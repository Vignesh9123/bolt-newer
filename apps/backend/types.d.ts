import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: { id: string }; // Modify according to your user structure
  }
}
