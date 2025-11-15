// src/services/aiService.ts
import api from './api';

export interface AIRecommendations {
  studyResources: string[];
  mentorship: string;
  jobOpportunities: string[];
  skillDevelopment: string[];
  generalAdvice: string;
}

export interface StudentContext {
  department?: string;
  yearOfStudy?: string;
  interests?: string;
  goals?: string;
}

/**
 * Get AI recommendations for a student
 */
export const getAIRecommendations = async (
  studentId: string,
  context: StudentContext
): Promise<AIRecommendations> => {
  try {
    const response = await api.post('/ai/recommendations', {
      studentId,
      context,
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting AI recommendations:', error);
    throw new Error(error.response?.data?.error || 'Failed to get AI recommendations');
  }
};

/**
 * Chat with AI assistant
 */
export const chatWithAI = async (
  message: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  context: StudentContext = {}
): Promise<{ message: string; role: string }> => {
  try {
    const response = await api.post('/ai/chat', {
      message,
      conversationHistory,
      context,
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error chatting with AI:', error);
    throw new Error(error.response?.data?.error || 'Failed to chat with AI');
  }
};

/**
 * Get study tips
 */
export const getStudyTips = async (
  subject?: string,
  topic?: string,
  difficulty?: string
): Promise<{ tips: string }> => {
  try {
    const response = await api.post('/ai/study-tips', {
      subject,
      topic,
      difficulty,
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting study tips:', error);
    throw new Error(error.response?.data?.error || 'Failed to get study tips');
  }
};

