/* eslint-disable linebreak-style */
/* eslint-disable indent */
import CategoryRepositories from './repositories.js';
import response from '../../utils/response.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';

export const createCategory = async (req, res, next) => {
    const { name } = req.validated;
    const { role } = req.user;

    if (role !== 'admin') {
        return next(new AuthorizationError('Anda tidak berhak menambahkan kategori'));
    }

    const category = await CategoryRepositories.createCategory({
        name
    });

    return response(res, 201, 'Kategori berhasil ditambahkan', category);
};

export const getAllCategories = async (req, res) => {
    const categories = await CategoryRepositories.getAllCategories();
    return response(res, 200, 'Daftar kategori berhasil diambil', categories);
};

export const getCategoryById = async (req, res, next) => {
    const { id } = req.params;

    const category = await CategoryRepositories.getCategoryById(id);
    if (!category) {
        return next(new NotFoundError('Kategori tidak ditemukan'));
    }

    return response(res, 200, 'Detail kategori berhasil diambil', category);
};

export const editCategoryById = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.validated;
    const { role } = req.user;

    if (role !== 'admin') {
        return next(new AuthorizationError('Anda tidak berhak mengedit kategori'));
    }

    const category = await CategoryRepositories.editCategoryById({
        id,
        name,
    });
    if (!category) {
        return next(new NotFoundError('Gagal memperbarui kategori. ID tidak ditemukan'));
    }

    return response(res, 200, 'Kategori berhasil diperbarui');
};

export const deleteCategoryById = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
        return next(new AuthorizationError('Anda tidak berhak menghapus kategori'));
    }

    const deletedCategory = await CategoryRepositories.deleteCategoryById(id);
    if (!deletedCategory) {
        return next(new NotFoundError('Gagal menghapus kategori. ID tidak ditemukan'));
    }

    return response(res, 200, 'Kategori berhasil dihapus');
};