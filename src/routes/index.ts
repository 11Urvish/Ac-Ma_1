import { Router } from 'express';
// import * as passport from 'passport';
const passport = require('passport');

import authRoute from '../modules/auth/auth.route';
import cityRoute from '../modules/city/city.route';
import customerRoute from '../modules/customer/customer.route';
import firmRoute from '../modules/firm/firm.route';
import loanRoute from '../modules/loan/loan.route';
import loanTransferRoute from '../modules/loan-transfer/loan-transfer.route';
import lookupRoute from '../modules/lookup/lookup.route';
import reportRoute from '../modules/report/report.route';
import roleRoute from '../modules/role/role.route';
import transactionRoute from '../modules/transaction/transaction.route';
import userRoute from '../modules/user/user.route';
import stateRoute from '../modules/state/state.route';
import districtRoute from '../modules/district/district.route';
import talukaRoute from '../modules/taluka/taluka.route';
import villageRoute from '../modules/village/village.route';
// import countryRoute from '../modules/country/country.route';

// const passportJwt = passport.authenticate('jwt', { session: false });

const passportJwt = passport.authenticate('jwt', { session: false });

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/city', passportJwt, cityRoute);
// router.use('/country', countryRoute);
router.use('/customer', passportJwt, customerRoute);
router.use('/firm', passportJwt, firmRoute);
router.use('/loan', passportJwt, loanRoute);
router.use('/state', stateRoute);
router.use('/district', districtRoute);
router.use('/taluka', talukaRoute);
router.use('/village', villageRoute);
router.use('/loan-transfer', passportJwt, loanTransferRoute);
router.use('/lookup', passportJwt, lookupRoute);
router.use('/report', passportJwt, reportRoute);
router.use('/role', passportJwt, roleRoute);
router.use('/transaction', passportJwt, transactionRoute);
router.use('/user', passportJwt, userRoute);

export default router;
