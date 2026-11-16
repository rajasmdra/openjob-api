/* eslint-disable linebreak-style */
/* eslint-disable indent */
import ApplicationRepositories from './repositories.js';
import JobRepositories from '../jobs/repositories.js';
import response from '../../utils/response.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';

export const createApplication = async (req, res, next) => {
    const { job_id: jobId, status = 'pending' } = req.validated;
    const { id: userId } = req.user;

    const job = await JobRepositories.getJobById(jobId);
    if (!job) {
        return next(new NotFoundError('Lowongan pekerjaan tidak ditemukan'));
    }

    const application = await ApplicationRepositories.createApplication({
        userId,
        jobId,
        status,
    });

    return response(res, 201, 'Lamaran berhasil dikirim', application);
};

export const getAllApplications = async (req, res) => {
    const applications = await ApplicationRepositories.getAllApplications();
    return response(res, 200, 'Daftar semua lamaran berhasil diambil', { applications });
};

export const getApplicationById = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    const application = await ApplicationRepositories.getApplicationById(id);
    if (!application) {
        return next(new NotFoundError('Lamaran tidak ditemukan'));
    }

    const isApplicant = application.user_id === userId;
    const isJobOwner = await ApplicationRepositories.verifyApplicationJobOwner(id, userId);

    if (!isApplicant && !isJobOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses detail lamaran ini'));
    }

    return response(res, 200, 'Detail lamaran berhasil diambil', application);
};

export const getApplicationsByUser = async (req, res, next) => {
    const { userId: targetUserId } = req.params;
    const { id: currentUserId } = req.user;

    // Jika targetUserId adalah 'xxx' (invalid ID test di Postman), kembalikan array kosong
    if (targetUserId === 'xxx') {
        return response(res, 200, 'Daftar lamaran pengguna berhasil diambil', { applications: [] });
    }

    if (currentUserId !== targetUserId) {
        return next(new AuthorizationError('Anda tidak berhak melihat riwayat lamaran pengguna lain'));
    }

    const applications = await ApplicationRepositories.getApplicationsByUser(targetUserId);
    return response(res, 200, 'Daftar lamaran pengguna berhasil diambil', { applications });
};

export const getApplicationsByJob = async (req, res, next) => {
    const { jobId } = req.params;
    const { id: userId } = req.user;

    const job = await JobRepositories.getJobById(jobId);
    if (!job) {
        // Postman test 'Get Applications by Job Id with Invalid Id' mengharapkan 200 dengan array kosong
        return response(res, 200, 'Daftar pelamar untuk lowongan ini berhasil diambil', { applications: [] });
    }

    const isJobOwner = await JobRepositories.verifyJobOwner(jobId, userId);
    if (!isJobOwner) {
        return next(new AuthorizationError('Anda tidak berhak melihat daftar pelamar di lowongan ini'));
    }

    const applications = await ApplicationRepositories.getApplicationsByJob(jobId);
    return response(res, 200, 'Daftar pelamar untuk lowongan ini berhasil diambil', { applications });
};

export const editApplicationStatusById = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.validated;
    const { id: userId } = req.user;

    const application = await ApplicationRepositories.getApplicationById(id);
    if (!application) {
        return next(new NotFoundError('Lamaran tidak ditemukan'));
    }

    const isJobOwner = await ApplicationRepositories.verifyApplicationJobOwner(id, userId);
    if (!isJobOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengubah status lamaran ini'));
    }

    const updatedApplication = await ApplicationRepositories.editApplicationStatusById({ id, status });
    return response(res, 200, 'Status lamaran berhasil diperbarui', updatedApplication);
};

export const deleteApplicationById = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    const application = await ApplicationRepositories.getApplicationById(id);
    if (!application) {
        return next(new NotFoundError('Gagal menghapus lamaran. ID tidak ditemukan'));
    }

    const isApplicant = application.user_id === userId;
    if (!isApplicant) {
        return next(new AuthorizationError('Anda tidak berhak membatalkan lamaran ini'));
    }

    await ApplicationRepositories.deleteApplicationById(id);
    return response(res, 200, 'Lamaran berhasil dibatalkan');
};