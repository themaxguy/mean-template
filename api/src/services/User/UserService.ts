/**
 * UserService - Responsible for calling User DAO methods
 */
import UserModel, { IUser, IUser_populated, IUserModel } from '@daos/User/UserSchema'

import logger from '@shared/Logger'

export interface IUserService {
  // getOne: (email: string) => Promise<IUser | null>;
  // getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<IUser>;
  // update: (user: IUser) => Promise<void>;
  // delete: (id: number) => Promise<void>;
}

export default class UserService implements IUserService {

  async add(user: IUser) {
    try {      
      return await new UserModel(user).save()
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
  
  // login(email: string, password: string) {
  //   return null;
  // }

  // getAll
  // add
  // update
  // delete
}