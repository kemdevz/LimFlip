'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  onlineCount: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineCount: 0,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('online-count', (count: number) => {
      setOnlineCount(count);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineCount }}>
      {children}
    </SocketContext.Provider>
  );
}
