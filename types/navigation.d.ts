export type RootStackParamList = {
  ChatRoom: {
    chatId: string;
    className: string;
    chatMode: 'announcement' | 'discussion';
    role: 'student' | 'lecturer';
  };
  // You can add more screens later, like:
  // Login: undefined;
  // Dashboard: undefined;
};
