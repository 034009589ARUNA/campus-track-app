import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform } from 'react-native';
import api from '../services/api';

/**
 * Helper to handle downloads with progress tracking.
 */
const downloadWithProgress = async (
  url: string,
  filename: string,
  mimeType: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {
        headers: {
          Authorization: String(api.defaults.headers.common['Authorization']),
        },
      },
      (progress) => {
        const progressRatio =
          progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
        onProgress?.(progressRatio);
      }
    );

    const { uri } = await downloadResumable.downloadAsync();
    console.log(`✅ File saved to: ${uri}`);

    // For mobile: open or share
    if (Platform.OS !== 'web') {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType,
          dialogTitle: 'Share or Open Report',
        });
      } else {
        Alert.alert('Success', `Report saved to: ${uri}`);
      }
    } else {
      // On web, open directly in new tab
      window.open(url, '_blank');
    }

    return uri;
  } catch (error) {
    console.error('❌ Download error:', error);
    throw error;
  }
};

/**
 * PDF report download
 */
export const generateAttendancePDF = async (
  sessionId: string,
  courseName: string,
  onProgress?: (progress: number) => void
) => {
  const url = `${api.defaults.baseURL}/reports/session/${sessionId}/pdf`;
  const filename = `attendance_${courseName}_${Date.now()}.pdf`;
  return downloadWithProgress(url, filename, 'application/pdf', onProgress);
};

/**
 * CSV report download
 */
export const generateAttendanceCSV = async (
  sessionId: string,
  courseName: string,
  onProgress?: (progress: number) => void
) => {
  const url = `${api.defaults.baseURL}/reports/session/${sessionId}/csv`;
  const filename = `attendance_${courseName}_${Date.now()}.csv`;
  return downloadWithProgress(url, filename, 'text/csv', onProgress);
};

/**
 * JSON report download
 */
export const generateAttendanceJSON = async (
  sessionId: string,
  courseName: string,
  onProgress?: (progress: number) => void
) => {
  const url = `${api.defaults.baseURL}/reports/session/${sessionId}/json`;
  const filename = `attendance_${courseName}_${Date.now()}.json`;
  return downloadWithProgress(url, filename, 'application/json', onProgress);
};

/**
 * List all downloaded reports
 */
export const listDownloadedReports = async (): Promise<string[]> => {
  try {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
    return files.filter(
      (f) =>
        f.startsWith('attendance_') &&
        (f.endsWith('.pdf') || f.endsWith('.csv') || f.endsWith('.json'))
    );
  } catch (error) {
    console.error('List reports error:', error);
    return [];
  }
};

/**
 * Delete a downloaded report
 */
export const deleteDownloadedReport = async (fileName: string): Promise<void> => {
  try {
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.deleteAsync(filePath);
    console.log(`🗑️ Deleted: ${fileName}`);
  } catch (error) {
    console.error('Delete report error:', error);
    throw error;
  }
};

/**
 * Get file size
 */
export const getReportFileSize = async (fileName: string): Promise<number> => {
  try {
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    const info = await FileSystem.getInfoAsync(filePath);
    return info.size || 0;
  } catch (error) {
    console.error('File size error:', error);
    return 0;
  }
};
