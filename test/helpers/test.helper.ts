import request from 'supertest';
import { Server } from 'http';
import { Express } from 'express';

let server: Server;

/**
 * Start the Express server for testing
 */
export const startServer = async (app: Express): Promise<Server> => {
    return new Promise((resolve) => {
        server = app.listen(0, () => {
            resolve(server);
        });
    });
};

/**
 * Stop the Express server
 */
export const stopServer = async (): Promise<void> => {
    return new Promise((resolve) => {
        if (server) {
            server.close(() => {
                resolve();
            });
        } else {
            resolve();
        }
    });
};

/**
 * Get the server base URL
 */
export const getBaseUrl = (): string => {
    if (!server) {
        throw new Error('Server not started');
    }
    const address = server.address();
    if (address && typeof address === 'object') {
        return `http://localhost:${address.port}`;
    }
    return 'http://localhost:3000';
};

/**
 * Make an authenticated request
 */
export const authedRequest = (app: Express) => {
    let authToken = '';

    return {
        setToken: (token: string) => {
            authToken = token;
        },
        get: (url: string) => {
            const req = request(app).get(url);
            if (authToken) {
                req.set('Authorization', `Bearer ${authToken}`);
            }
            return req;
        },
        post: (url: string) => {
            const req = request(app).post(url);
            if (authToken) {
                req.set('Authorization', `Bearer ${authToken}`);
            }
            return req;
        },
        put: (url: string) => {
            const req = request(app).put(url);
            if (authToken) {
                req.set('Authorization', `Bearer ${authToken}`);
            }
            return req;
        },
        patch: (url: string) => {
            const req = request(app).patch(url);
            if (authToken) {
                req.set('Authorization', `Bearer ${authToken}`);
            }
            return req;
        },
        delete: (url: string) => {
            const req = request(app).delete(url);
            if (authToken) {
                req.set('Authorization', `Bearer ${authToken}`);
            }
            return req;
        },
    };
};

export type AuthedRequest = ReturnType<typeof authedRequest>;
