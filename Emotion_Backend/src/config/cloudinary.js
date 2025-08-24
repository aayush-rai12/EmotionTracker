import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'; 

dotenv.config();

// setup cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// function for upload image on clodinary 
export const uploadImage = async(filePath, folderName) => {
  
  if (!filePath) {
    console.error('Cloudinary upload error: filePath is missing or undefined');
    throw new Error('Cloudinary upload error: filePath is missing or undefined');
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png'],  
    });
    return result;
  } catch (error) {
     console.error('Error uploading to Cloudinary', error);
    return error;
  }
};

// Function to delete image from Cloudinary

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary', error);
    return error;
  }
}

export { cloudinary };