// Add user to req
export {}
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}