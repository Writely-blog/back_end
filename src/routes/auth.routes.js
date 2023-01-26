import { Router } from 'express';

import {
  register,
  login,
  getUserNameById,
} from '../controllers/auth.controllers.js';

const router = Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/user/:id').get(getUserNameById);

export default router;
