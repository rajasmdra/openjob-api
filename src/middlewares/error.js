/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import response from '../utils/response.js';
import { ClientError } from '../exceptions/index.js';

const ErrorHandler = (err, req, res, next) => {
    if (err instanceof ClientError) {
        return response(res, err.statusCode, err.message, null);
    }

    if (err.isJoi) {
        return response(res, 400, err.details[0].message, null);
    }

    const status = err.statusCode || err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    console.error('Unhandled error:', err);

    const message = (isProduction && status >= 500)
        ? 'Internal Server Error'
        : (err.message || 'Internal Server Error');

    return response(res, status, message, null);
};

export default ErrorHandler;