
import { Router } from 'express'
import AuthController from '@controllers/AuthController'

const router = Router()

// init controllers
const authController = new AuthController()

/**
 * Add new user - "POST /api/auth/signup"
 */
router.post('/signup', authController.signup)

/**
 * Login User - "POST /api/auth/login"
 */
router.post('/login', authController.login)


/**
 * Logout User - "GET /api/auth/logout"
 */
router.get('/logout', authController.logout);

export default router;
