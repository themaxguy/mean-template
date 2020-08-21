/**
 * AuthController - Responsible for handling user related http requests
 */

import { Request, Response } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';

import logger from '@shared/Logger';
import {
  paramMissingError,
  loginFailedErr,
  cookieProps,
} from '@shared/constants';

import { IUser, UserRoles } from '@daos/User/UserSchema';

import AuthService from '@services/Auth/AuthService';
import UserService from '@services/User/UserService';

const userService = new UserService();
const authService = new AuthService();

export default class AuthController {
  constructor() {}

  async signup(req: Request, res: Response, next: Function) {
    // check parameters
    const user = req.body;

    // return bad request if no user was passed
    if (!user) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError,
      });
    }

    // add standard role to new user
    user.role = UserRoles.Standard;

    try {
      // add and return new user and jwt
      const newUser: IUser = await userService.add(user);
      const { key, jwt, options } = await authService.getCookieProps(newUser);
      res.cookie(key, jwt, options);
      res.status(OK).json();
    } catch (err) {
      logger.error(err.message);
      res.status(BAD_REQUEST).json() && next(err);
    }
  }

  async login(req: Request, res: Response, next: Function) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).json({
        error: loginFailedErr,
      });
    }

    try {
      const user = await authService.login(email, password);

      const { key, jwt, options } = await authService.getCookieProps(user);
      res.cookie(key, jwt, options);
      res.status(OK).json()
    } catch (err) {
      logger.error('error logging in from AuthController:', err.message);
      res.status(UNAUTHORIZED).json({
        error: loginFailedErr,
      });
    }
  }

  async logout(req: Request, res: Response) {
    const { key, options } = cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).json();
  }
}
