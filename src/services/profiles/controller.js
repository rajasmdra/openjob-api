/* eslint-disable linebreak-style */
/* eslint-disable indent */
import UserRepositories from '../users/repositories.js';
import ApplicationRepositories from '../applications/repositories.js';
import BookmarkRepositories from '../bookmarks/repositories.js';
import response from '../../utils/response.js';
import NotFoundError from '../../exceptions/not-found-error.js';

export const getMyProfile = async (req, res, next) => {
    const { id: userId } = req.user;

    const profile = await UserRepositories.getUserById(userId);
    if (!profile) {
        return next(new NotFoundError('Profil pengguna tidak ditemukan'));
    }

    return response(res, 200, 'Profil berhasil diambil', profile);
};

export const getMyApplications = async (req, res) => {
    const { id: userId } = req.user;

    const applications = await ApplicationRepositories.getApplicationsByUser(userId);
    return response(res, 200, 'Daftar lamaran saya berhasil diambil', { applications });
};

export const getMyBookmarks = async (req, res) => {
    const { id: userId } = req.user;

    const bookmarks = await BookmarkRepositories.getAllBookmarks(userId);
    return response(res, 200, 'Daftar bookmark saya berhasil diambil', { bookmarks });
};