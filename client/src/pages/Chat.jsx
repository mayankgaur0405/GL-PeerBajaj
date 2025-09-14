import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { useUnreadCount } from '../context/UnreadCountContext.jsx';
import api from '../lib/api.js';
import ChatBox from '../components/ChatBox.jsx';

export default function Chat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { messageCount, updateMessageCount, fetchUnreadCounts } = useUnreadCount();
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchChats();
    fetchUnreadCounts();
  }, [fetchUnreadCounts]);

  // Auto-open chat when navigated with ?userId=
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      startNewChat(userId);
    }
  }, [searchParams]);

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
          updateMessageCount(messageCount + 1);
        }
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, selectedChat, messageCount, updateMessageCount]);

  const fetchChats = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const response = await api.get('/chat', {
        params: { page, limit: 20 }
      });
      const raw = response.data.chats || [];
      const pagination = response.data.pagination;
      
      if (append) {
        setChats(prev => [...prev, ...raw]);
      } else {
        // Dedupe by other user to avoid duplicate rows showing for same person
        const byOther = new Map();
        for (const chat of raw) {
          const other = getOtherUserFrom(chat);
          const key = other?._id || chat._id;
          const existing = byOther.get(key);
          if (!existing) {
            byOther.set(key, chat);
          } else {
            const a = existing.lastMessage?.timestamp ? new Date(existing.lastMessage.timestamp).getTime() : 0;
            const b = chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp).getTime() : 0;
            if (b > a) byOther.set(key, chat);
          }
        }
        setChats(Array.from(byOther.values()));
      }
      
      // Update pagination state
      setCurrentPage(page);
      setHasMore(pagination ? page < pagination.pages : false);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Function to mark messages as read when chat is opened
  const markMessagesAsRead = async (chatId) => {
    try {
      await api.put(`/chat/${chatId}/read`);
      // Refresh the unread count after marking as read
      fetchUnreadCounts();
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
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
      // Mark messages as read when opening a chat
      markMessagesAsRead(newChat._id);
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

  const getOtherUserFrom = (chat) => {
    return chat.participants?.find?.(p => p._id !== user?._id) || null;
  };

  // Search users to start chat
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await api.get(`/users/search`, { params: { username: q } });
        setSearchResults(res.data.users || []);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const getUnreadCountForChat = (chat) => {
    // This would need to be calculated based on unread messages
    // For now, return 0 as we don't have this data in the chat list
    return 0;
  };

  const loadMoreChats = () => {
    if (!loadingMore && hasMore) {
      fetchChats(currentPage + 1, true);
    }
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
          <div className="p-4 border-b glass-divider space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
              {messageCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {messageCount}
                </span>
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-slate-900">
                {searching ? (
                  <div className="p-3 text-center text-white/60">Searching...</div>
                ) : searchResults.length ? (
                  searchResults.map((u) => (
                    <div key={u._id} onClick={() => { startNewChat(u._id); setSearchQuery(''); setSearchResults([]); }} className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer">
                      <img src={u.profilePicture || '/default-avatar.svg'} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="text-white text-sm truncate">{u.name}</div>
                        <div className="text-white/60 text-xs truncate">@{u.username}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-white/60">No users found</div>
                )}
              </div>
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
                      onClick={() => {
                        setSelectedChat(chat);
                        markMessagesAsRead(chat._id);
                      }}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedChat?._id === chat._id ? 'bg-white/10 border-r-2 border-blue-500' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={otherUser?.profilePicture || '/default-avatar.svg'}
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
            
            {/* Load More Button */}
            {hasMore && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMoreChats}
                  disabled={loadingMore}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More Chats'}
                </button>
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
                      src={user.profilePicture || '/default-avatar.svg'}
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
