import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const router: Router = Router();
const nx = new NxService();
const ds = new AuthService(nx);
const ctrl = new AuthController(ds);

router.post('/login', ctrl.login);

export default router;
