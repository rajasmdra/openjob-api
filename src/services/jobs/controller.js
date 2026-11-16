/* eslint-disable linebreak-style */
/* eslint-disable indent */
import JobRepositories from './repositories.js';
import CompanyRepositories from '../companies/repositories.js';
import response from '../../utils/response.js';
import AuthorizationError from '../../exceptions/authorization-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

export const createJob = async (req, res, next) => {
    const payload = req.validated;
    const { id: owner } = req.user;

    const company = await CompanyRepositories.getCompanyById(payload.company_id);
    if (!company) {
        return next(new InvariantError('Company ID tidak ditemukan'));
    }

    const isCompanyOwner = await CompanyRepositories.verifyCompanyOwner(payload.company_id, owner);
    if (!isCompanyOwner) {
        return next(new AuthorizationError('Anda bukan pemilik perusahaan ini'));
    }

    const job = await JobRepositories.createJob(payload);
    if (!job) {
        return next(new InvariantError('Lowongan pekerjaan gagal ditambahkan'));
    }

    return response(res, 201, 'Lowongan pekerjaan berhasil ditambahkan', job);
};

export const getAllJobs = async (req, res) => {
    const { title, 'company-name': companyName, companyId, categoryId } = req.query;

    const jobs = await JobRepositories.getAllJobs({ title, companyName, companyId, categoryId });
    return response(res, 200, 'Daftar lowongan pekerjaan berhasil diambil', { jobs });
};

export const getJobsByCompanyId = async (req, res) => {
    const { companyId } = req.params;
    const jobs = await JobRepositories.getJobsByCompanyId(companyId);
    return response(res, 200, 'Daftar lowongan berdasarkan perusahaan berhasil diambil', { jobs });
};

export const getJobsByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    const jobs = await JobRepositories.getJobsByCategoryId(categoryId);
    return response(res, 200, 'Daftar lowongan berdasarkan kategori berhasil diambil', { jobs });
};

export const getJobById = async (req, res, next) => {
    const { id } = req.params;

    const job = await JobRepositories.getJobById(id);
    if (!job) {
        return next(new NotFoundError('Lowongan pekerjaan tidak ditemukan'));
    }

    return response(res, 200, 'Detail lowongan pekerjaan berhasil diambil', job);
};

export const editJobById = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.validated;
    const { id: owner } = req.user;

    const existingJob = await JobRepositories.getJobById(id);
    if (!existingJob) {
        return next(new NotFoundError('Gagal memperbarui lowongan. ID tidak ditemukan'));
    }

    const isOwner = await JobRepositories.verifyJobOwner(id, owner);
    if (!isOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const job = await JobRepositories.editJobById({ id, ...payload });
    if (!job) {
        return next(new NotFoundError('Gagal memperbarui lowongan. ID tidak ditemukan'));
    }

    return response(res, 200, 'Lowongan pekerjaan berhasil diperbarui');
};

export const deleteJobById = async (req, res, next) => {
    const { id } = req.params;
    const { id: owner } = req.user;

    const existingJob = await JobRepositories.getJobById(id);
    if (!existingJob) {
        return next(new NotFoundError('Gagal menghapus lowongan. ID tidak ditemukan'));
    }

    const isJobOwner = await JobRepositories.verifyJobOwner(id, owner);
    if (!isJobOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const deletedJob = await JobRepositories.deleteJobById(id);
    if (!deletedJob) {
        return next(new NotFoundError('Gagal menghapus lowongan. ID tidak ditemukan'));
    }

    return response(res, 200, 'Lowongan pekerjaan berhasil dihapus');
};