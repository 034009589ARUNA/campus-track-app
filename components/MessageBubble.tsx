import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types/chat';

interface Props {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, isOwnMessage }) => {
  return (
    <View style={[styles.container, isOwnMessage ? styles.own : styles.other]}>
      <Text style={styles.text}>{message.text}</Text>
      <Text style={styles.role}>{message.role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  own: { backgroundColor: '#DCF8C5', alignSelf: 'flex-end' },
  other: { backgroundColor: '#ECECEC', alignSelf: 'flex-start' },
  text: { fontSize: 16 },
  role: { fontSize: 10, color: 'gray', marginTop: 2 },
});

export default MessageBubble;
