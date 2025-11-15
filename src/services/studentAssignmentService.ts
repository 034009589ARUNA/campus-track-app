// src/services/studentAssignmentService.ts
import axios from 'axios';

const getBackendUrl = () => {
  const BACKEND_IP = '192.168.0.200';
  return `http://${BACKEND_IP}:5000`;
};

const axiosInstance = axios.create({
  baseURL: `${getBackendUrl()}/api/student-assignments`,
  timeout: 10000,
});

/**
 * Get all available assignments for student
 */
export const getAvailableAssignments = async (studentId: string) => {
  try {
    console.log('📚 Fetching available assignments...');
    const response = await axiosInstance.get(`/available/${studentId}`);
    console.log('✅ Assignments fetched:', response.data.data.length);
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error fetching assignments:', error);
    throw error;
  }
};

/**
 * Get student's submission for an assignment
 */
export const getStudentSubmission = async (assignmentId: string, studentId: string) => {
  try {
    console.log('🔍 Fetching submission...');
    const response = await axiosInstance.get(`/${assignmentId}/submission/${studentId}`);
    console.log('✅ Submission fetched');
    return response.data.data;
  } catch (error) {
    console.error('❌ Error fetching submission:', error);
    throw error;
  }
};

/**
 * Submit an assignment
 */
export const submitAssignment = async (
  assignmentId: string,
  studentId: string,
  fileUrl: string,
  fileName: string
) => {
  try {
    console.log('📤 Submitting assignment...');
    const response = await axiosInstance.post('/submit', {
      assignmentId,
      studentId,
      fileUrl,
      fileName,
    });
    console.log('✅ Assignment submitted');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error submitting assignment:', error);
    throw {
      message: error.response?.data?.error || 'Failed to submit assignment',
      details: error.response?.data,
    };
  }
};

/**
 * Get all student's submissions
 */
export const getMySubmissions = async (studentId: string) => {
  try {
    console.log('📋 Fetching my submissions...');
    const response = await axiosInstance.get(`/my-submissions/${studentId}`);
    console.log('✅ Submissions fetched:', response.data.data.length);
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    throw error;
  }
};

/**
 * Get student's grades
 */
export const getMyGrades = async (studentId: string) => {
  try {
    console.log('📊 Fetching my grades...');
    const response = await axiosInstance.get(`/grades/${studentId}`);
    console.log('✅ Grades fetched');
    return response.data.data;
  } catch (error) {
    console.error('❌ Error fetching grades:', error);
    throw error;
  }
};