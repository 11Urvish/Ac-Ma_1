import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
const passport = require("passport");

const passportJwt = passport.authenticate('jwt', { session: false });

const router: Router = Router();
const nx = new NxService();
const ds = new UserService(nx);
const ctrl = new UserController(ds);

router.get('/findById', ctrl.findById);
router.get('/findUserSettingsById', ctrl.findUserSettingsById);
router.post('/findAll', ctrl.findAll);
router.post('/create', ctrl.create);
router.post('/update', ctrl.update);
router.post('/updateSetting', ctrl.updateSetting);
router.post('/delete', ctrl.delete);
router.post('/updateProfile', ctrl.updateProfile);
router.post('/changePassword', ctrl.changePassword);
router.post('/updateFinancialYear', passportJwt, ctrl.updateFinancialYear);

export default router;
