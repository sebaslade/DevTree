import type{Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    //middleware tiene acceso a req, res y next
    //Manejo de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
    } else {
        next(); // ✅ IMPORTANTE: llamar next() si no hay errores
    }
}