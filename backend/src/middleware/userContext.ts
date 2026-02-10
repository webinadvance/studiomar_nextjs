import { Request, Response, NextFunction } from 'express';

/**
 * User context middleware
 * Extracts user information from request and attaches it to req.user
 *
 * Currently uses hardcoded mock user with id=1 as placeholder.
 * Can be upgraded to JWT/session extraction later without changing service layer.
 */
export const userContext = (req: Request, res: Response, next: NextFunction): void => {
  // TODO: Replace with actual JWT/session extraction when auth is implemented
  req.user = { id: 1 };
  next();
};
