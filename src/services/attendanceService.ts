// src/services/attendanceService.ts
import api from './api';

// Local utility: Haversine distance for frontend calculations
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const attendanceService = {
  // ==================== STUDENT ENDPOINTS ====================

  /**
   * Mark attendance with code, GPS location & geofence validation
   */
  markAttendance: async (
    code: string,
    latitude: number,
    longitude: number,
    accuracy: number
  ) => {
    try {
      const response = await api.post('/student/attendance/mark', {
        code: code.toUpperCase(),
        latitude,
        longitude,
        accuracy,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get student's attendance history
   */
  getAttendanceHistory: async () => {
    try {
      const response = await api.get('/student/attendance/history');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get today's attendance status
   */
  getTodayAttendance: async () => {
    try {
      const response = await api.get('/student/attendance/today');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // ==================== LECTURER ENDPOINTS ====================

  /**
   * Create class session with venue location & geofence radius
   */
  createClassSession: async (
    courseName: string,
    duration: number,
    subject: string,
    venueLatitude: number,
    venueLongitude: number,
    location?: string,
    geofenceRadius: number = 50
  ) => {
    try {
      const response = await api.post('/lecturer/attendance/session/create', {
        courseName,
        duration,
        subject,
        location,
        venueLatitude,
        venueLongitude,
        geofenceRadius,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get active sessions
   */
  getActiveSessions: async () => {
    try {
      const response = await api.get('/lecturer/attendance/sessions/active');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get session details with geofence statistics
   */
  getSessionAttendance: async (sessionId: string) => {
    try {
      const response = await api.get(`/lecturer/attendance/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * End session
   */
  endClassSession: async (sessionId: string) => {
    try {
      const response = await api.put(`/lecturer/attendance/session/${sessionId}/end`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // remove attendance record
   generateAttendancePDF: async (sessionId: string) => {
    try {
      const response = await api.get(`/reports/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
  
};