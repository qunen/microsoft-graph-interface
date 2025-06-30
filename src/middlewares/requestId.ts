import { type NextFunction, type Request, type Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

const setRequestId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.headers['x-request-id'];
    if (typeof id === 'string') req.id = id;
    else req.id = uuidV4();
    res.setHeader('X-Request-Id', req.id);
    next();
}

export default setRequestId;