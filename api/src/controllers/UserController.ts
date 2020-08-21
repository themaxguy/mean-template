/**
 * UserController - Responsible for handling user related http requests
 */

import AuthService from '@services/Auth/AuthService'
import UserService from '@services/User/UserService'

import { Request, Response } from 'express'
import { BAD_REQUEST, OK } from 'http-status-codes'

import { IUser } from '@daos/User/UserSchema'

import { paramMissingError } from '@shared/constants'
import { UserRoles } from '@daos/User/UserSchema'
import logger from '@shared/Logger'

const userService = new UserService()
const authService = new AuthService()

export default class UserController {
  constructor() {}
}
