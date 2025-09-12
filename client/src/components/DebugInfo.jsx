import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';

export default function DebugInfo() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const debugInfo = {
    environment: import.meta.env.MODE,
    apiBase: import.meta.env.VITE_API_BASE,
    user: user ? { id: user._id, name: user.name } : null,
    socket: {
      connected: isConnected,
      id: socket?.id,
      url: socket?.io?.uri
    },
    timestamp: new Date().toISOString()
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-40">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}


