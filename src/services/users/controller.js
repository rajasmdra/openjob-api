/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable indent */
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';
import UserRepositories from './repositories.js';
import CacheService from '../../cache/redis-service.js';
import AuthorizationError from '../../exceptions/authorization-error.js';

export const createUser = async (req, res, next) => {
    const { name, email, password, role } = req.validated;

    const isNewEmail = await UserRepositories.verifyNewEmail(email);
    if (!isNewEmail) {
        return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
    }

    const user = await UserRepositories.createUser({
        name,
        email,
        password,
        role,
    });

    if (!user) {
        return next(new InvariantError('User gagal ditambahkan'));
    }

    return response(res, 201, 'User berhasil ditambahkan', { id: user });
};

export const getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const cachedData = await CacheService.get(`users:${id}`);
        res.setHeader('X-Data-Source', 'cache');
        return response(res, 200, 'User berhasil ditampilkan', JSON.parse(cachedData));
    } catch (error) {}

    const user = await UserRepositories.getUserById(id);
    if (!user) {
        return next(new NotFoundError('User tidak ditemukan'));
    }

    await CacheService.set(`users:${id}`, JSON.stringify(user));
    res.setHeader('X-Data-Source', 'database');
    return response(res, 200, 'User berhasil ditampilkan', {
        id: user.id,
        name: user.name
    });
};

export const editUserById = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { name, email } = req.validated;

    if (id !== userId) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }
    const user = await UserRepositories.getUserById(id);
    if (!user) {
        return next(new NotFoundError('Gagal memperbarui pengguna. ID tidak ditemukan'));
    }

    await UserRepositories.editUserById({ id, name, email });
    await CacheService.delete(`users:${id}`);
    return response(res, 200, 'User berhasil diperbarui');
};