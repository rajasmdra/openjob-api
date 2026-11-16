/* eslint-disable linebreak-style */
/* eslint-disable indent */
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';
import UserRepositories from './repositories.js';

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
    const user = await UserRepositories.getUserById(id);

    if (!user) {
        return next(new NotFoundError('User tidak ditemukan'));
    }

    return response(res, 200, 'User berhasil ditampilkan', { name: user.name });
};