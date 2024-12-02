const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryUploadResult {
  id: string;
  url: string;
  name: string;
  type: string;
  uploadDate: string;
}

class CloudinaryService {
  async uploadFile(file: File): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error('Configuration Cloudinary manquante');
    }
    
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        id: data.public_id,
        url: data.secure_url,
        name: file.name,
        type: file.type,
        uploadDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
