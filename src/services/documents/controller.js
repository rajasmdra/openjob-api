/* eslint-disable linebreak-style */
/* eslint-disable indent */
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
import DocumentRepositories from './repositories.js';
import { UPLOAD_FOLDER } from './storage-config.js';
import ClientError from '../../exceptions/client-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';
import response from '../../utils/response.js';

export const createDocument = async (req, res, next) => {
    if (!req.file) {
        return next(new ClientError('File is required'));
    }

    const documentId = nanoid(16);
    const { filename, originalname, size } = req.file;

    const document = await DocumentRepositories.createDocument({
        id: documentId,
        filename,
        originalName: originalname,
        size,
    });

    if (!document) {
        return next(new InvariantError('Dokumen gagal ditambahkan'));
    }

    const documentData = {
        documentId,
        filename,
        originalName: originalname,
        size,
    };

    return response(res, 201, 'Dokumen berhasil ditambahkan', documentData);
};

export const getAllDocuments = async (req, res) => {
    const documents = await DocumentRepositories.getAllDocuments();
    const mappedDocuments = documents.map((doc) => ({
        ...doc,
        originalName: doc.original_name,
    }));

    return response(res, 200, 'Dokumen sukses ditampilkan', { documents: mappedDocuments });
};

export const getDocumentById = async (req, res, next) => {
    const { id } = req.params;

    const document = await DocumentRepositories.getDocumentById(id);

    if (!document) {
        return next(new NotFoundError('Dokumen tidak ditemukan'));
    }

    const filePath = path.join(UPLOAD_FOLDER, document.filename);

    if (!fs.existsSync(filePath)) {
        return next(new NotFoundError('File fisik dokumen tidak ditemukan di server'));
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.original_name}"`);

    return res.sendFile(filePath);
};

export const deleteDocumentById = async (req, res, next) => {
    const { id } = req.params;

    const existingDocument = await DocumentRepositories.getDocumentById(id);
    if (!existingDocument) {
        return next(new NotFoundError('Gagal menghapus dokumen. ID tidak ditemukan'));
    }

    await DocumentRepositories.deleteDocumentById(id);

    const filePath = path.join(UPLOAD_FOLDER, existingDocument.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return response(res, 200, 'Dokumen berhasil dihapus');
};