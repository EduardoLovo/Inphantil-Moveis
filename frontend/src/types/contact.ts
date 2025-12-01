export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
    userId?: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}
