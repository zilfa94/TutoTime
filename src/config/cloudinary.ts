interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: "dru9rthjv",
  apiKey: "274641167689823",
  apiSecret: "QFhQyjeMVmt34wqejEKdA-nLJUk"
};

export const generateSignature = async (timestamp: number): Promise<string> => {
  const stringToSign = `timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(stringToSign).digest('hex');
};

export const uploadToCloudinary = async (file: File, folder: string = 'tutorials'): Promise<string> => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = await generateSignature(timestamp);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', cloudinaryConfig.apiKey);
  formData.append('signature', signature);
  formData.append('folder', folder);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'upload:', error);
    throw new Error(error instanceof Error ? error.message : 'Échec de l\'upload vers Cloudinary');
  }
};
