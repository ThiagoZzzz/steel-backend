import { getAllProducts, getProductById, getProductBySlug, createProduct, deleteProduct, updateProduct } from "../services/productService.js";
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// TODO implementar filtros y paginación
export const getAllProductsController = catchAsync(async (req, res) => {
    const products = await getAllProducts();
    res.status(200).json({
        status: 'success',
        message: 'Catálogo de productos obtenido correctamente',
        data: { products },
        meta: {
            totalItems: products.length
        }
    });
});

export const getProductByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;

    const product = await getProductById(id);

    res.status(200).json({
        status: 'success',
        message: 'Producto obtenido correctamente',
        data: { product }
    });
});

export const getProductBySlugController = catchAsync(async (req, res) => {
    const { slug } = req.params;

    const product = await getProductBySlug(slug);

    res.status(200).json({
        status: 'success',
        message: 'Producto obtenido correctamente',
        data: { product }
    });
});

export const createProductController = catchAsync(async (req, res) => {
    const { name, price, stock, description, category } = req.body;

    // Multer y Cloudinary inyectan la info del archivo subido en req.file
    // req.file.path contiene la URL pública hacia Cloudinary
    const image = req.file?.path;

    if (!image) {
        throw new AppError('La imagen es obligatoria', 400);
    }

    let data = {
        name,
        image, // Guardamos la URL de Cloudinary
        price: Number(price), // Parseamos a número
        description,
        stock: stock ? Number(stock) : 0,
        category
    };

    const product = await createProduct(data);

    res.status(201).json({
        status: 'success',
        message: 'Producto creado correctamente',
        data: { product }
    });
});

export const updateProductController = catchAsync(async (req, res) => {
    const { id } = req.params;

    const { name, price, description, stock, category } = req.body;

    // Si el usuario subió una nueva imagen, multer la captura acá
    const image = req.file?.path;

    // 2. Armamos un objeto limpio y dinámico
    let updateData = {};

    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image; // Guarda la nueva URL
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (category !== undefined) updateData.category = category;

    // 3. Le pasamos ese objeto limpio al servicio
    const updatedProduct = await updateProduct(id, updateData);

    res.status(200).json({
        status: 'success',
        message: 'Producto actualizado correctamente',
        data: { product: updatedProduct }
    });
});

export const deleteProductController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await deleteProduct(id);

    res.status(200).json({
        status: 'success',
        message: 'Producto eliminado correctamente',
        data: { product }
    });
});