export interface Chat {
  _id: string;
  classId: string;
  participants: string[];
  chatMode: 'announcement' | 'discussion'; // <-- mode
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  role: 'student' | 'lecturer';
  createdAt: string;
  updatedAt?: string;
}
