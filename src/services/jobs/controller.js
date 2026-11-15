/* eslint-disable linebreak-style */
/* eslint-disable indent */
import JobRepositories from './JobRepositories.js';
import CompanyRepositories from '../companies/CompanyRepositories.js';
import response from '../../utils/response.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

export const createJob = async (req, res, next) => {
    const { title, description, companyId, categoryId } = req.validated;
    const { id: owner, role } = req.user;

    if (role !== 'employer' && role !== 'admin') {
        return next(new AuthorizationError('Anda tidak berhak menambahkan lowongan pekerjaan'));
    }

    if (role === 'employer') {
        const isCompanyOwner = await CompanyRepositories.verifyCompanyOwner(companyId, owner);
        if (!isCompanyOwner) {
            return next(new AuthorizationError('Anda bukan pemilik perusahaan ini'));
        }
    }

    const job = await JobRepositories.createJob({
        title,
        description,
        companyId,
        categoryId,
    });

    return response(res, 201, 'Lowongan pekerjaan berhasil ditambahkan', job);
};

export const getAllJobs = async (req, res) => {
    const { title, companyId, categoryId } = req.query;

    const jobs = await JobRepositories.getAllJobs({ title, companyId, categoryId });
    return response(res, 200, 'Daftar lowongan pekerjaan berhasil diambil', jobs);
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
    const { title, description, categoryId } = req.validated;
    const { id: owner, role } = req.user;

    if (role === 'employer') {
        const isOwner = await JobRepositories.verifyJobOwner(id, owner);
        if (!isOwner) {
            return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
        }
    }

    const job = await JobRepositories.editJobById({
        id,
        title,
        description,
        categoryId,
    });
    if (!job) {
        return next(new NotFoundError('Gagal memperbarui lowongan. ID tidak ditemukan'));
    }

    return response(res, 200, 'Lowongan pekerjaan berhasil diperbarui');
};

export const deleteJobById = async (req, res, next) => {
    const { id } = req.params;
    const { id: owner, role } = req.user;

    if (role === 'employer') {
        const isJobOwner = await JobRepositories.verifyJobOwner(id, owner);
        if (!isJobOwner) {
            return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
        }
    }

    const deletedJob = await JobRepositories.deleteJobById(id);
    if (!deletedJob) {
        return next(new NotFoundError('Gagal menghapus lowongan. ID tidak ditemukan'));
    }

    return response(res, 200, 'Lowongan pekerjaan berhasil dihapus');
};