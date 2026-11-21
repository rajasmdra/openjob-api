/* eslint-disable linebreak-style */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import AuthorizationError from '../../exceptions/authorization-error.js';
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import response from '../../utils/response.js';
import CompanyRepositories from './repositories.js';
import CacheService from '../../cache/redis-service.js';

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

    await CacheService.delete(`companies:${company}`);
    return response(res, 201, 'Perusahaan berhasil ditambahkan', company);
};

export const getAllCompanies = async (req, res) => {
    const companies = await CompanyRepositories.getAllCompanies();
    return response(res, 200, 'Perusahaan sukses ditampilkan', { companies });
};

export const getCompanyById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const cachedData = await CacheService.get(`companies:${id}`);
        res.setHeader('X-Data-Source', 'cache');
        return response(res, 200, 'Perusahaan sukses ditampilkan', JSON.parse(cachedData));
    } catch (error) {}

    const company = await CompanyRepositories.getCompanyById(id);
    if (!company) {
        return next(new NotFoundError('Perusahaan tidak ditemukan'));
    }

    await CacheService.set(`companies:${id}`, JSON.stringify(company));
    res.setHeader('X-Data-Source', 'database');
    return response(res, 200, 'Perusahaan sukses ditampilkan', company);
};

export const editCompanyById = async (req, res, next) => {
    const { id } = req.params;
    const { name, location, description } = req.validated;
    const { id: owner } = req.user;

    const existingCompany = await CompanyRepositories.getCompanyById(id);
    if (!existingCompany) {
        return next(new NotFoundError('Gagal memperbarui perusahaan. ID tidak ditemukan'));
    }

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

    await CacheService.delete(`companies:${id}`);
    return response(res, 200, 'Perusahaan berhasil diperbarui', company);
};

export const deleteCompanyById = async (req, res, next) => {
    const { id } = req.params;
    const { id: owner } = req.user;

    const existingCompany = await CompanyRepositories.getCompanyById(id);
    if (!existingCompany) {
        return next(new NotFoundError('Gagal menghapus perusahaan. ID tidak ditemukan'));
    }

    const isOwner = await CompanyRepositories.verifyCompanyOwner(id, owner);
    if (!isOwner) {
        return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    await CompanyRepositories.deleteCompanyById(id);
    await CacheService.delete(`companies:${id}`);
    return response(res, 200, 'Perusahaan berhasil dihapus');
};