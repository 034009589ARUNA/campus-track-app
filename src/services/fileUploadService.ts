// src/services/fileUploadService.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import api from './api';

const API_BASE_URL = 'http://192.168.0.200:5000/api';

/**
 * Pick a file using expo-document-picker
 */
export const pickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.type === 'cancel') {
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error picking file:', error);
    throw error;
  }
};

/**
 * Upload a file to the server
 */
export const uploadFile = async (fileUri: string, fileName: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    
    // Extract file extension
    const fileExtension = fileName.split('.').pop();
    const mimeType = getMimeType(fileExtension);
    
    // @ts-ignore - FormData types in React Native
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    });

    const response = await fetch(`${API_BASE_URL}/upload/assignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload file');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

/**
 * Get MIME type from file extension
 */
const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

