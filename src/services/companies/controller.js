/* eslint-disable linebreak-style */
/* eslint-disable indent */
import AuthorizationError from '../../exceptions/authorization-error.js';
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';
import CompanyRepositories from './repositories.js';

export const createCompany = async (req, res, next) => {
    const { name, location, description } = req.validated;
    const { id: owner } = req.user;

    const company = await CompanyRepositories.createCompany({
        name,
        location,
        description,
        owner
    });

    if (!company) {
        return next(new InvariantError('Perusahaan gagal ditambahkan'));
    }

    return response(res, 201, 'Perusahaan berhasil ditambahkan', company);
};

export const getAllCompanies = async (req, res) => {
    const companies = await CompanyRepositories.getAllCompanies();
    return response(res, 200, 'Perusahaan sukses ditampilkan', companies);
};

export const getCompanyById = async (req, res, next) => {
    const { id } = req.params;

    const company = await CompanyRepositories.getCompanyById(id);
    if (!company) {
        return next(new NotFoundError('Perusahaan tidak ditemukan'));
    }

    return response(res, 200, 'Perusahaan sukses ditampilkan', company);
};

export const editCompanyById = async (req, res, next) => {
    const { id } = req.params;
    const { id: owner } = req.user;
    const { name, description, location } = req.validated;

    const isOwner = await CompanyRepositories.verifyCompanyOwner(id, owner);
    if (!isOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const company = await CompanyRepositories.editCompanyById({
        id,
        name,
        location,
        description,
    });
    if (!company) {
        return next(new NotFoundError('Perusahaan tidak ditemukan'));
    }

    return response(res, 200, 'Perusahaan berhasil diperbarui', company);
};

export const deleteCompanyById = async (req, res, next) => {
    const { id } = req.params;
    const { id: owner } = req.user;

    const isOwner = await CompanyRepositories.verifyCompanyOwner(id, owner);
    if (!isOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const deletedCompany = await CompanyRepositories.deleteCompanyById(id);
    if (!deletedCompany) {
        return next(new NotFoundError('Perusahaan tidak ditemukan'));
    }

    return response(res, 200, 'Perusahaan berhasil dihapus', deletedCompany);
};