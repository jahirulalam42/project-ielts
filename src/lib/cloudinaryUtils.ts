import cloudinary from './cloudinary';

// Delete audio file from Cloudinary
export const deleteAudioFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video' // Cloudinary uses 'video' for audio files
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error deleting audio from Cloudinary:', error);
    return { success: false, error };
  }
};

// Get audio file info from Cloudinary
export const getAudioInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video'
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error getting audio info from Cloudinary:', error);
    return { success: false, error };
  }
};

// List all audio files in the IELTS folder
export const listAudioFiles = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      prefix: 'ielts-speaking-audio/',
      max_results: 100
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error listing audio files from Cloudinary:', error);
    return { success: false, error };
  }
};

// Get Cloudinary URL with transformations
export const getAudioUrl = (publicId: string, options: {
  format?: string;
  quality?: string;
  fetch_format?: string;
} = {}) => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    ...options
  });
}; 