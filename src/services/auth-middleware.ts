import { config } from '@gateway/config';
import { IAuthPayload, NotAuthorizedError } from '@wuyuding2583/jobber-shared';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'gateway-service verifyUser() method');
    }

    try {
      const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not valid. Please login again.', 'gateway-service verifyUser() method');
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route.', 'gateway-service checkAuthentication() method');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
