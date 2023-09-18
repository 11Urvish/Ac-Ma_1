import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

const router: Router = Router();
const nx = new NxService();
const ds = new RoleService(nx);
const ctrl = new RoleController(ds);

router.get('/findById', ctrl.findById);
router.get('/findPermissionsByRoleId', ctrl.findPermissionsByRoleId);
router.post('/findAll', ctrl.findAll);
router.post('/create', ctrl.create);
router.post('/createRoleToPermission', ctrl.createRoleToPermission);
router.post('/update', ctrl.update);
router.post('/delete', ctrl.delete);

export default router;
