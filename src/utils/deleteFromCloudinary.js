import cloudinary from 'cloudinary';
import AppError from "./AppError.js";

// obtiene el id público para manipular la imagen en Cloudinary  
export const extractPublicId = (url) => {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');

    if (uploadIndex === -1) {
        throw new AppError('URL de Cloudinary inválida', 400);
    }

    return parts.slice(uploadIndex + 2).join('/').replace(/\.[^/.]+$/, '');
};

export const deleteFromCloudinary = async (url) => {
    try {
        const publicId = extractPublicId(url);
        await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
        throw new AppError('Error al eliminar la imagen de Cloudinary', 500);
    }
};