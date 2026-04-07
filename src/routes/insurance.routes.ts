import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getPolicies,
  createPolicy,
  deletePolicy,
  getClaims,
  createClaim,
  updateClaimStatus,
  deleteClaim,
} from '../controllers/insurance.controller';

const router = Router();
router.use(authenticate);

router.get('/policies', getPolicies);
router.post('/policies', createPolicy);
router.delete('/policies/:id', deletePolicy);
router.get('/claims', getClaims);
router.post('/claims', createClaim);
router.patch('/claims/:id/status', updateClaimStatus);
router.delete('/claims/:id', deleteClaim);

export default router;
