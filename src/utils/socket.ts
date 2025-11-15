import { io, Socket } from 'socket.io-client';
import { Message } from '../../types/chat';

const SERVER_URL = 'http://192.168.0.200:5000'; // <-- your backend IP and port

// Create socket connection
export const socket: Socket = io(SERVER_URL, {
  transports: ['websocket'],
});

// Type for sending messages
export interface SendMessagePayload {
  chatId: string;
  senderId: string;
  text: string;
  role: 'student' | 'lecturer';
}

// Optional helper for joining a chat room
export const joinChatRoom = (chatId: string) => {
  socket.emit('joinChat', chatId);
};

// Send a message
export const sendMessage = (payload: SendMessagePayload) => {
  socket.emit('sendMessage', payload);
};

// Listen for incoming messages
export const onMessage = (callback: (message: Message) => void) => {
  socket.on('message', callback);
};

// Remove listener
export const offMessage = () => {
  socket.off('message');
};
