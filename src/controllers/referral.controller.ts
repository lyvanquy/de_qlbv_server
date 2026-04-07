import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { successResponse, errorResponse } from '../utils/response';

export const getReferrals = async (req: Request, res: Response) => {
  try {
    const { patientId, status, page = '1', limit = '20' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where, skip, take: Number(limit),
        include: { patient: { select: { id: true, name: true, patientCode: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.referral.count({ where }),
    ]);
    return successResponse(res, { referrals, total, page: Number(page) });
  } catch (e) { return errorResponse(res, e, 'getReferrals'); }
};

export const getReferral = async (req: Request, res: Response) => {
  try {
    const ref = await prisma.referral.findUnique({
      where: { id: req.params.id },
      include: { patient: true },
    });
    if (!ref) return res.status(404).json({ message: 'Not found' });
    return successResponse(res, ref);
  } catch (e) { return errorResponse(res, e, 'getReferral'); }
};

export const createReferral = async (req: Request, res: Response) => {
  try {
    console.log('[createReferral] Request body:', req.body);
    const ref = await prisma.referral.create({ data: req.body });
    return successResponse(res, ref, 201);
  } catch (e) { return errorResponse(res, e, 'createReferral'); }
};

export const updateReferral = async (req: Request, res: Response) => {
  try {
    console.log('[updateReferral] Request body:', req.body);
    const ref = await prisma.referral.update({ where: { id: req.params.id }, data: req.body });
    return successResponse(res, ref);
  } catch (e) { return errorResponse(res, e, 'updateReferral'); }
};

export const deleteReferral = async (req: Request, res: Response) => {
  try {
    await prisma.referral.delete({ where: { id: req.params.id } });
    return successResponse(res, { deleted: true });
  } catch (e) { return errorResponse(res, e, 'deleteReferral'); }
};
