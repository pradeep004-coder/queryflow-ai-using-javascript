import { loginController, signupController } from './auth.controller.js';
import { signupMiddleware, loginMiddleware } from './auth.middleware.js';

import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', loginMiddleware, loginController);
authRouter.post('/signup', signupMiddleware, signupController);

export default authRouter;