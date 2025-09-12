import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import api from '../lib/api.js';
import ChatBox from '../components/ChatBox.jsx';

export default function Chat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchChats();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', (data) => {
        // Update chat list with new message
        setChats(prev => 
          prev.map(chat => 
            chat._id === data.chatId 
              ? { 
                  ...chat, 
                  lastMessage: {
                    content: data.message.content,
                    sender: data.message.sender,
                    timestamp: data.message.createdAt
                  }
                }
              : chat
          )
        );
        
        // Update unread count
        if (selectedChat?._id !== data.chatId) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, selectedChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat');
      setChats(response.data.chats || []);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/chat/unread-count');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const startNewChat = async (userId) => {
    try {
      const response = await api.post(`/chat/user/${userId}`);
      const newChat = response.data.chat;
      
      // Add to chats list if not already present
      setChats(prev => {
        const exists = prev.some(chat => chat._id === newChat._id);
        if (!exists) {
          return [newChat, ...prev];
        }
        return prev;
      });
      
      setSelectedChat(newChat);
    } catch (err) {
      console.error('Failed to start new chat:', err);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return messageDate.toLocaleDateString();
  };

  const getOtherUser = (chat) => {
    return chat.participants.find(p => p._id !== user?._id);
  };

  const getUnreadCountForChat = (chat) => {
    // This would need to be calculated based on unread messages
    // For now, return 0 as we don't have this data in the chat list
    return 0;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex h-96">
          <div className="w-1/3 glass-card p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 ml-6 glass-card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">💬 Messages</h1>
        <p className="text-white/60">Chat with other users in real-time</p>
      </div>

      <div className="flex h-[600px] glass-card overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r glass-divider flex flex-col">
          <div className="p-4 border-b glass-divider">
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-white/60">
                <div className="text-4xl mb-2">💬</div>
                <p>No conversations yet</p>
                <p className="text-sm">Start a conversation with someone!</p>
              </div>
            ) : (
              <div className="divide-y">
                {chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  const unreadCount = getUnreadCountForChat(chat);
                  
                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedChat?._id === chat._id ? 'bg-white/10 border-r-2 border-blue-500' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={otherUser?.profilePicture || '/default-avatar.png'}
                            alt={otherUser?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {otherUser?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate text-white">{otherUser?.name}</h3>
                            {chat.lastMessage && (
                              <span className="text-xs text-white/60">
                                {formatTime(chat.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white/70 truncate">
                              {chat.lastMessage?.content || 'No messages yet'}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatBox 
              chatId={selectedChat._id} 
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start New Chat Modal */}
      <StartNewChatModal 
        isOpen={false} // You can add state for this
        onClose={() => {}} // You can add state for this
        onStartChat={startNewChat}
      />
    </div>
  );
}

// Start New Chat Modal Component
function StartNewChatModal({ isOpen, onClose, onStartChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await api.get(`/users/search?username=${encodeURIComponent(query)}`);
      setSearchResults(response.data.users || []);
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Start New Chat</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-4 max-h-64 overflow-y-auto">
            {searching ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      onStartChat(user._id);
                      onClose();
                    }}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-4 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Start typing to search for users
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
