import AppError from '../utils/AppError.js';
import { Product } from "../models/index.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

export const getAllProducts = async () => {
    return await Product.findAll({
        raw: true
    });
}

// publico para el detalle
export const getProductBySlug = async (slug) => {
    if (!slug) throw new AppError('El slug es obligatorio', 400);

    const product = await Product.findOne({ where: { slug }, raw: true });

    if (!product) throw new AppError('Producto no encontrado', 404);

    return product;
}

// uso interno
export const getProductById = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new AppError('Producto no encontrado', 404);
    }

    return product;
}

// recibe un objeto con los campos mapeados
export const createProduct = async (data) => {
    const newProduct = await Product.create(data)

    return newProduct
}

// recibe un objeto con los campos mapeados
export const updateProduct = async (id, updateData) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new AppError('Producto no encontrado', 404);
    }

    if (updateData.image && product.image) {
        await deleteFromCloudinary(product.image);
    }
    // Solo actualizará lo que venga dentro de updateData.
    await product.update(updateData);

    return product;
}

export const deleteProduct = async (id) => {
    if (!id) {
        throw new AppError('El id es obligatorio', 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new AppError('Producto no encontrado', 404);
    }

    if (product.image) {
        await deleteFromCloudinary(product.image);
    }

    await product.destroy();
    return product;
}

// manejar el discount y featured
// update status