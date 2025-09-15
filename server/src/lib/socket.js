import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../models/User.js';
import { Chat } from '../models/Chat.js';
import { Notification } from '../models/Notification.js';
import { EditorDoc } from '../models/EditorDoc.js';

// Store active users
const activeUsers = new Map();

// In-memory collaboration rooms (ephemeral)
const collabRooms = new Map(); // roomId -> { code, language, users: Set<string>, output, files?: [{_id,name,language,content}], activeFileId?: string }

export function setupSocketHandlers(io) {
  // Authentication middleware for socket connections (bypass for /collab namespace)
  io.use(async (socket, next) => {
    if (socket.nsp?.name === '/collab') {
      return next();
    }
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name username profilePicture isOnline');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected with socket ${socket.id}`);
    
    // Add user to active users
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date()
    });

    // Update user online status
    User.findByIdAndUpdate(socket.userId, { 
      isOnline: true, 
      lastSeen: new Date() 
    }).exec();

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle joining chat rooms
    socket.on('join_chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = chat.participants.some(
          participant => participant.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to join this chat' });
          return;
        }

        socket.join(`chat_${chatId}`);
        socket.emit('joined_chat', { chatId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      socket.emit('left_chat', { chatId });
    });

    // Handle new messages
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type = 'text', media } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = chat.participants.some(
          participant => participant.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to send messages in this chat' });
          return;
        }

        // Add message to chat
        await chat.addMessage(socket.userId, content, type, media);

        // Get the other participant
        const otherParticipant = chat.participants.find(
          participant => participant.toString() !== socket.userId
        );

        // Create notification for new message
        await Notification.createNotification({
          receiverId: otherParticipant,
          senderId: socket.userId,
          type: 'chat',
          chatId: chat._id,
          metadata: {
            message: content.length > 50 ? content.substring(0, 50) + '...' : content
          }
        });

        // Populate the message data
        await chat.populate('messages.sender', 'name username profilePicture');

        const newMessage = chat.messages[chat.messages.length - 1];

        // Emit to all participants in the chat
        io.to(`chat_${chatId}`).emit('new_message', {
          chatId,
          message: newMessage
        });

        // Emit notification to the other participant
        if (otherParticipant) {
          io.to(`user_${otherParticipant}`).emit('new_notification', {
            type: 'chat',
            message: 'New message received'
          });
        }

      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: false
      });
    });

    // Handle post likes
    socket.on('post_liked', async (data) => {
      try {
        const { postId, postAuthorId } = data;

        // Emit to post author if they're online
        if (postAuthorId !== socket.userId) {
          io.to(`user_${postAuthorId}`).emit('post_liked', {
            postId,
            likedBy: {
              id: socket.userId,
              name: socket.user.name,
              username: socket.user.username
            }
          });

          // Emit notification
          io.to(`user_${postAuthorId}`).emit('new_notification', {
            type: 'like',
            message: `${socket.user.name} liked your post`
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to process like' });
      }
    });

    // Handle post comments
    socket.on('post_commented', async (data) => {
      try {
        const { postId, postAuthorId } = data;

        // Emit to post author if they're online
        if (postAuthorId !== socket.userId) {
          io.to(`user_${postAuthorId}`).emit('post_commented', {
            postId,
            commentedBy: {
              id: socket.userId,
              name: socket.user.name,
              username: socket.user.username
            }
          });

          // Emit notification
          io.to(`user_${postAuthorId}`).emit('new_notification', {
            type: 'comment',
            message: `${socket.user.name} commented on your post`
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to process comment' });
      }
    });

    // Handle new followers
    socket.on('user_followed', async (data) => {
      try {
        const { followedUserId } = data;

        // Emit to followed user if they're online
        if (followedUserId !== socket.userId) {
          io.to(`user_${followedUserId}`).emit('user_followed', {
            followedBy: {
              id: socket.userId,
              name: socket.user.name,
              username: socket.user.username
            }
          });

          // Emit notification
          io.to(`user_${followedUserId}`).emit('new_notification', {
            type: 'follow',
            message: `${socket.user.name} started following you`
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to process follow' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${socket.user.username} disconnected`);
      
      // Remove user from active users
      activeUsers.delete(socket.userId);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      }).exec();

      // Notify all chats that user is offline
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        username: socket.user.username
      });
    });
  });

  // Collaboration namespace (no auth, uses roomId + name)
  const collab = io.of('/collab');

  collab.on('connection', (socket) => {
    console.log('Collab connected', socket.id);

    let currentRoom = null;
    let currentUser = null;

    // Chat messages
    socket.on('chatMessage', ({ roomId, sender, text, time }) => {
      if (!roomId) return;
      const msg = {
        sender: sender || 'User',
        text: String(text || ''),
        time: time || Date.now()
      };
      socket.to(String(roomId)).emit('chatMessage', msg);
    });

    // Join a room
    socket.on('join', async ({ roomId, userName }) => {
      const roomKey = String(roomId || '');
      const user = String(userName || 'User');
      if (!roomKey || !user) return;

      if (currentRoom) {
        socket.leave(currentRoom);
        const prev = collabRooms.get(currentRoom);
        if (prev) {
          prev.users.delete(currentUser);
          collab.to(currentRoom).emit('userJoined', Array.from(prev.users));
        }
      }

      currentRoom = roomKey;
      currentUser = user;
      socket.join(roomKey);

      if (!collabRooms.has(roomKey)) {
        // Initialize from DB if present
        const doc = await EditorDoc.findOne({ roomId: roomKey });
        if (doc && doc.files?.length) {
          const primary = doc.files.find(f => f._id?.toString() === doc.activeFileId) || doc.files[0];
          collabRooms.set(roomKey, { code: primary.content || '', language: primary.language || 'javascript', users: new Set(), output: doc.output || '', files: doc.files.map(f=>({ _id: f._id.toString(), name: f.name, language: f.language, content: f.content })), activeFileId: (doc.activeFileId || primary._id?.toString()) });
        } else {
          collabRooms.set(roomKey, { code: '', language: 'javascript', users: new Set(), output: '', files: [{ _id: new Date().getTime().toString(36), name: 'main', language: 'javascript', content: '' }], activeFileId: undefined });
        }
      }
      const room = collabRooms.get(roomKey);
      room.users.add(user);
      collab.to(roomKey).emit('userJoined', Array.from(room.users));

      // Send current state to the joiner
      socket.emit('codeUpdate', room.code);
      socket.emit('languageUpdate', room.language);
      socket.emit('filesState', { files: room.files || [], activeFileId: room.activeFileId || null });
      if (room.output) socket.emit('codeResponse', { run: { output: room.output } });
    });

    // Code changes
    socket.on('codeChange', async ({ roomId, code }) => {
      const roomKey = String(roomId || '');
      const room = collabRooms.get(roomKey);
      if (!room) return;
      room.code = String(code || '');
      socket.to(roomKey).emit('codeUpdate', room.code);
      // Debounced/lightweight persistence
      try {
        const existing = await EditorDoc.findOne({ roomId: roomKey });
        if (!existing) {
          const created = await EditorDoc.create({ roomId: roomKey, files: [{ name: 'main', language: room.language, content: room.code }], activeFileId: undefined, output: room.output });
          await EditorDoc.updateOne({ _id: created._id }, { $set: { activeFileId: created.files[0]._id.toString() } });
        } else {
          // Update active file or first file
          let fileId = existing.activeFileId || existing.files?.[0]?._id?.toString();
          if (!fileId) {
            existing.files.push({ name: 'main', language: room.language, content: room.code });
            fileId = existing.files[existing.files.length - 1]._id.toString();
            existing.activeFileId = fileId;
          } else {
            const f = existing.files.id(fileId);
            if (f) {
              f.content = room.code;
              f.language = room.language;
            }
          }
          await existing.save();
        }
      } catch {}
    });

    // Typing indicator
    socket.on('typing', ({ roomId, userName }) => {
      const roomKey = String(roomId || '');
      socket.to(roomKey).emit('userTyping', String(userName || 'User'));
    });

    // Language change
    socket.on('languageChange', async ({ roomId, language }) => {
      const roomKey = String(roomId || '');
      const room = collabRooms.get(roomKey);
      if (!room) return;
      room.language = String(language || 'javascript');
      collab.to(roomKey).emit('languageUpdate', room.language);
      try {
        const activeId = room.activeFileId;
        if (activeId) {
          await EditorDoc.updateOne({ roomId: roomKey, 'files._id': activeId }, { $set: { 'files.$.language': room.language } });
        }
      } catch {}
    });

    // Compile via Piston API
    socket.on('compileCode', async ({ code, roomId, language, version }) => {
      const roomKey = String(roomId || '');
      if (!collabRooms.has(roomKey)) {
        // Try to initialize from DB on-demand
        try {
          const doc = await EditorDoc.findOne({ roomId: roomKey });
          if (doc && doc.files?.length) {
            const primary = doc.files.find(f => f._id?.toString() === doc.activeFileId) || doc.files[0];
            collabRooms.set(roomKey, { code: primary.content || '', language: primary.language || 'javascript', users: new Set(), output: doc.output || '' });
          } else {
            collabRooms.set(roomKey, { code: String(code||''), language: String(language||'javascript'), users: new Set(), output: '' });
          }
        } catch {
          collabRooms.set(roomKey, { code: String(code||''), language: String(language||'javascript'), users: new Set(), output: '' });
        }
      }
      try {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language,
          version: version || '*',
          files: [{ content: String(code || '') }]
        });
        const output = response.data?.run?.output || '';
        const room = collabRooms.get(roomKey);
        room.output = output;
        collab.to(roomKey).emit('codeResponse', response.data);
        try { await EditorDoc.updateOne({ roomId: roomKey }, { $set: { output } }); } catch {}
      } catch (e) {
        const msg = e?.response?.data ? JSON.stringify(e.response.data) : (e.message || 'Compile failed')
        collab.to(roomKey).emit('codeResponse', { run: { output: String(msg) } });
      }
    });

    // ===== Multi-file operations =====
    socket.on('fileCreate', async ({ roomId, name, language }) => {
      const roomKey = String(roomId || '');
      if (!roomKey) return;
      const room = collabRooms.get(roomKey);
      if (!room) return;
      const newName = String(name || 'untitled');
      const newLang = String(language || room.language || 'javascript');
      try {
        const doc = await EditorDoc.findOne({ roomId: roomKey });
        if (!doc) {
          // ensure main exists and then add requested file name
          const initialFiles = [{ name: 'main', language: newLang, content: '' }];
          if (newName !== 'main') initialFiles.push({ name: newName, language: newLang, content: '' });
          const created = await EditorDoc.create({ roomId: roomKey, files: initialFiles, activeFileId: undefined });
          const activeId = created.files[0]._id.toString();
          await EditorDoc.updateOne({ _id: created._id }, { $set: { activeFileId: activeId } });
          const fresh = await EditorDoc.findById(created._id);
          room.files = fresh.files.map(f => ({ _id: f._id.toString(), name: f.name, language: f.language, content: f.content }));
          room.activeFileId = fresh.activeFileId?.toString() || activeId;
          room.code = fresh.files.id(room.activeFileId)?.content || '';
          room.language = fresh.files.id(room.activeFileId)?.language || newLang;
        } else {
          // do not remove main; ensure unique newFile names
          const names = new Set(doc.files.map(f => f.name));
          let candidate = newName.startsWith('newFile_') ? newName : 'newFile_1';
          let n = 1;
          while (names.has(candidate)) { n += 1; candidate = `newFile_${n}`; }
          doc.files.push({ name: candidate, language: newLang, content: '' });
          doc.activeFileId = doc.files[doc.files.length - 1]._id.toString();
          await doc.save();
          const fresh = await EditorDoc.findById(doc._id);
          room.files = fresh.files.map(f => ({ _id: f._id.toString(), name: f.name, language: f.language, content: f.content }));
          room.activeFileId = fresh.activeFileId?.toString();
          const active = fresh.files.id(room.activeFileId);
          room.code = active?.content || '';
          room.language = active?.language || newLang;
        }
        collab.to(roomKey).emit('filesState', { files: room.files, activeFileId: room.activeFileId });
        collab.to(roomKey).emit('codeUpdate', room.code);
        collab.to(roomKey).emit('languageUpdate', room.language);
      } catch {}
    });

    socket.on('fileRename', async ({ roomId, fileId, name }) => {
      const roomKey = String(roomId || '');
      const room = collabRooms.get(roomKey);
      if (!room || !room.files) return;
      const newName = String(name || '');
      try {
        await EditorDoc.updateOne({ roomId: roomKey, 'files._id': fileId }, { $set: { 'files.$.name': newName } });
        const fresh = await EditorDoc.findOne({ roomId: roomKey });
        room.files = fresh.files.map(f => ({ _id: f._id.toString(), name: f.name, language: f.language, content: f.content }));
        collab.to(roomKey).emit('filesState', { files: room.files, activeFileId: room.activeFileId });
      } catch {}
    });

    socket.on('fileDelete', async ({ roomId, fileId }) => {
      const roomKey = String(roomId || '');
      const room = collabRooms.get(roomKey);
      if (!room || !room.files) return;
      try {
        await EditorDoc.updateOne({ roomId: roomKey }, { $pull: { files: { _id: fileId } } });
        const fresh = await EditorDoc.findOne({ roomId: roomKey });
        room.files = (fresh?.files || []).map(f => ({ _id: f._id.toString(), name: f.name, language: f.language, content: f.content }));
        // Update active file selection safely
        if (!fresh || fresh.files.length === 0) {
          room.activeFileId = null;
          room.code = '';
        } else {
          const nextId = fresh.activeFileId?.toString() || fresh.files[0]._id.toString();
          room.activeFileId = nextId;
          const active = fresh.files.id(nextId);
          room.code = active?.content || '';
          room.language = active?.language || room.language;
          collab.to(roomKey).emit('languageUpdate', room.language);
        }
        collab.to(roomKey).emit('codeUpdate', room.code);
        collab.to(roomKey).emit('filesState', { files: room.files, activeFileId: room.activeFileId });
      } catch {}
    });

    socket.on('fileSwitch', async ({ roomId, fileId }) => {
      const roomKey = String(roomId || '');
      const room = collabRooms.get(roomKey);
      if (!room || !room.files) return;
      const f = room.files.find(x => x._id === fileId);
      if (!f) return;
      room.activeFileId = fileId;
      room.code = f.content || '';
      room.language = f.language || 'javascript';
      socket.emit('codeUpdate', room.code);
      collab.to(roomKey).emit('languageUpdate', room.language);
      collab.to(roomKey).emit('filesState', { files: room.files, activeFileId: room.activeFileId });
      try {
        await EditorDoc.updateOne({ roomId: roomKey }, { $set: { activeFileId: fileId } });
      } catch {}
    });

    // Explicit save (force persist current buffer)
    socket.on('fileSave', async ({ roomId, fileId, content, language }) => {
      const roomKey = String(roomId || '');
      const room = collabRooms.get(roomKey);
      if (!room) return;
      const fid = fileId || room.activeFileId;
      room.code = String(content ?? room.code ?? '');
      room.language = String(language || room.language || 'javascript');
      // update in-memory files list
      if (room.files && fid) {
        const f = room.files.find(x => x._id === fid);
        if (f) {
          f.content = room.code;
          f.language = room.language;
        }
      }
      collab.to(roomKey).emit('filesState', { files: room.files || [], activeFileId: room.activeFileId });
      try {
        const doc = await EditorDoc.findOne({ roomId: roomKey });
        if (!doc) {
          const created = await EditorDoc.create({ roomId: roomKey, files: [{ name: 'main', language: room.language, content: room.code }], activeFileId: undefined });
          await EditorDoc.updateOne({ _id: created._id }, { $set: { activeFileId: created.files[0]._id.toString() } });
        } else {
          const targetId = fid || doc.activeFileId || doc.files?.[0]?._id?.toString();
          if (targetId) {
            const f = doc.files.id(targetId);
            if (f) {
              f.content = room.code;
              f.language = room.language;
            }
            if (!doc.activeFileId) doc.activeFileId = targetId;
          } else {
            doc.files.push({ name: 'main', language: room.language, content: room.code });
            doc.activeFileId = doc.files[doc.files.length - 1]._id.toString();
          }
          await doc.save();
        }
        socket.emit('saved', { ok: true });
      } catch (e) {
        socket.emit('saved', { ok: false, error: e?.message || 'Failed to save' });
      }
    });

    // Leave room
    socket.on('leaveRoom', () => {
      if (currentRoom && currentUser) {
        const room = collabRooms.get(currentRoom);
        if (room) {
          room.users.delete(currentUser);
          collab.to(currentRoom).emit('userJoined', Array.from(room.users));
        }
        socket.leave(currentRoom);
        currentRoom = null;
        currentUser = null;
      }
    });

    socket.on('disconnect', () => {
      if (currentRoom && currentUser) {
        const room = collabRooms.get(currentRoom);
        if (room) {
          room.users.delete(currentUser);
          collab.to(currentRoom).emit('userJoined', Array.from(room.users));
        }
      }
      console.log('Collab disconnected', socket.id);
    });
  });

  // Helper function to get online users
  io.getOnlineUsers = () => {
    return Array.from(activeUsers.values());
  };

  // Helper function to emit to specific user
  io.emitToUser = (userId, event, data) => {
    io.to(`user_${userId}`).emit(event, data);
  };

  return io;
}
