import bcrypt from 'bcrypt'
import { JwtService } from '@services/Auth/JwtService'

import { cookieProps, loginFailedErr } from '@shared/constants'

import UserModel, { IUser } from '@daos/User/UserSchema'
import logger from '@shared/Logger'

const jwtService = new JwtService()

export interface ICookieProps {
  key: string
  jwt: string
  options: object
}

export interface IAuthService {
  getCookieProps: (user: IUser) => Promise<ICookieProps>
  login: (email: string, password: string) => Promise<IUser>
}

export default class AuthService implements IAuthService {
  async getCookieProps(user: IUser) {
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
      id: user.id,
      role: user.role,
    });
    const { key, options } = cookieProps;
    return { key, jwt, options };
  }

  async login(email: string, password: string): Promise<IUser> {
    // check email & password exist
    if (!email || !password) throw Error(loginFailedErr)

    try {
      // fetch user
      const user = await UserModel.findByEmail(email)
      if (!user) throw Error(loginFailedErr)
      
      // check password
      const pwdPassed = await bcrypt.compare(password, user.password)
      if (!pwdPassed) throw Error(loginFailedErr)

      // return success
      return user
    } catch (err) {
      logger.error('login failed (auth service)', err.message)
      throw Error(loginFailedErr)
    }
  }

}
