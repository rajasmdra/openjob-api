/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable indent */
import BookmarkRepositories from './repositories.js';
import JobRepositories from '../jobs/repositories.js';
import response from '../../utils/response.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';
import CacheService from '../../cache/redis-service.js';

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

    await CacheService.delete(`bookmarks:user:${userId}`);
    return response(res, 201, 'Lowongan berhasil ditambahkan ke bookmark', bookmark);
};

export const getAllBookmarks = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const cachedData = await CacheService.get(`bookmarks:user:${userId}`);
        res.setHeader('X-Data-Source', 'cache');
        return response(res, 200, 'Bookmark berhasil diambil', JSON.parse(cachedData));
    } catch (error) {}

    const bookmarks = await BookmarkRepositories.getAllBookmarks(userId);
    await CacheService.set(`bookmarks:user:${userId}`, JSON.stringify({ bookmarks }));
    res.setHeader('X-Data-Source', 'database');
    return response(res, 200, 'Bookmark berhasil diambil', { bookmarks });
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

    return response(res, 200, 'Bookmark berhasil diambil', bookmark);
};

export const deleteBookmarkByJobId = async (req, res, next) => {
    const { jobId } = req.params;
    const { id: userId } = req.user;

    const deletedId = await BookmarkRepositories.deleteBookmarkByJobAndUser(jobId, userId);
    if (!deletedId) {
        return next(new NotFoundError('Gagal menghapus bookmark. ID tidak ditemukan'));
    }
    await CacheService.delete(`bookmarks:user:${userId}`);
    return response(res, 200, 'Bookmark berhasil dihapus');
};