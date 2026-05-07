import { v2 as cloudinary } from 'cloudinary';

// se autoconfigura si detecta la variable de entorno CLOUDINARY_URL.
cloudinary.config();

export default cloudinary;