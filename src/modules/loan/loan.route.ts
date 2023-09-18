import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

const router: Router = Router();
const nx = new NxService();
const ds = new LoanService(nx);
const ctrl = new LoanController(ds);

router.get('/findById', ctrl.findById);
router.get('/findUniqueLoanNumber', ctrl.findUniqueLoanNumber);
router.post('/findAll', ctrl.findAll);
router.post('/create', ctrl.create);
router.post('/update', ctrl.update);
router.post('/delete', ctrl.delete);
router.post('/exportLoan', ctrl.exportLoan);
router.post('/test', ctrl.exportLoan);
router.post('/exportForm', ctrl.exportForm);
//router.post('/test', ctrl.exportForm);


export default router;
