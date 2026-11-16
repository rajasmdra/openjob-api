/* eslint-disable linebreak-style */
/* eslint-disable indent */
import BookmarkRepositories from './repositories.js';
import JobRepositories from '../jobs/repositories.js';
import response from '../../utils/response.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

export const createBookmarks = async (req, res, next) => {
    const { jobId } = req.params;
    const { id: userId } = req.user;

    const job = await JobRepositories.getJobById(jobId);
    if (!job) {
        return next(new NotFoundError('Lowongan pekerjaan tidak ditemukan'));
    }

    const isExists = await BookmarkRepositories.verifyBookmarkExists(userId, jobId);
    if (isExists) {
        return next(new InvariantError('Lowongan sudah ada di dalam bookmark'));
    }

    const bookmark = await BookmarkRepositories.createBookmarks({
        userId,
        jobId,
    });

    return response(res, 201, 'Lowongan berhasil ditambahkan ke bookmark', bookmark);
};

export const getAllBookmarks = async (req, res) => {
    const { id: userId } = req.user;

    const bookmarks = await BookmarkRepositories.getAllBookmarks(userId);
    return response(res, 200, 'Daftar bookmark berhasil diambil', { bookmarks });
};

export const getBookmarkById = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    const bookmark = await BookmarkRepositories.getBookmarkById(id);
    if (!bookmark) {
        return next(new NotFoundError('Bookmark tidak ditemukan'));
    }

    const isOwner = await BookmarkRepositories.verifyBookmarkOwner(id, userId);
    if (!isOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    return response(res, 200, 'Detail bookmark berhasil diambil', bookmark);
};

export const deleteBookmarkByJobId = async (req, res, next) => {
    const { jobId } = req.params;
    const { id: userId } = req.user;

    const deletedId = await BookmarkRepositories.deleteBookmarkByJobAndUser(jobId, userId);
    if (!deletedId) {
        return next(new NotFoundError('Gagal menghapus bookmark. Data tidak ditemukan'));
    }

    return response(res, 200, 'Bookmark berhasil dihapus');
};