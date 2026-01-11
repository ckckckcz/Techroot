import type { IncomingHttpHeaders } from 'http';

export interface ExpressRequest {
    body: Record<string, unknown>;
    params: Record<string, string>;
    query: Record<string, unknown>;
    headers: IncomingHttpHeaders;
    user?: {
        userId: string;
        email: string;
    };
}

export interface ExpressResponse {
    status(code: number): ExpressResponse;
    json(data: unknown): ExpressResponse;
    send(data: unknown): ExpressResponse;
}

export type ExpressNextFunction = () => void;

export interface AuthenticatedRequest extends ExpressRequest {
    user: {
        userId: string;
        email: string;
    };
}
