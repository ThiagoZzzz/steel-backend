import multer from 'multer';
import cloudinary from 'cloudinary';

// parsea el multipart/form-data: extrae los campos de texto a req.body (.single() en la ruta) y guarda el archivo como un buffer en RAM (req.file.buffer).
export const parseFormData = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedFormats.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no permitido. Solo se aceptan: jpg, png, webp.'));
        }
    }
});

// sube lo guardado en el buffer de la RAM a Cloudinary
export const uploadToCloudinary = (req, res, next) => {
    // Si no hay archivo (ej: en un PATCH sin imagen nueva), seguimos sin problema
    if (!req.file) return next();

    const targetFolder = process.env.CLOUDINARY_FOLDER;

    const stream = cloudinary.v2.uploader.upload_stream(
        {
            folder: targetFolder,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
        (error, result) => {
            if (error) {
                return next(new Error(`Error al subir imagen a Cloudinary: ${error.message}`));
            }

            // Inyectamos la URL pública de Cloudinary en req.file.path
            // para que el controlador la lea igual que antes
            req.file.path = result.secure_url;
            req.file.filename = result.public_id;

            next();
        }
    );

    // Enviamos el Buffer que Multer guardó en memoria hacia el stream de Cloudinary
    stream.end(req.file.buffer);
};
// * pasos de subida de archivos: 1) parseFormData -> 2) validateSchema -> 3) uploadToCloudinary