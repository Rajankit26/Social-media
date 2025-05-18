import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'socialmedia_uploads',  
    allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'pdf', 'docx'],
  },
});

const upload = multer({ storage });
export default upload;