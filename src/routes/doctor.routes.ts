import { Router } from 'express';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();
router.use(authenticate);

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.post('/', authorize('ADMIN'), createDoctor);
router.put('/:id', authorize('ADMIN'), updateDoctor);
router.delete('/:id', authorize('ADMIN'), deleteDoctor);

export default router;
