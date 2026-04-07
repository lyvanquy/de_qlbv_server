import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ok, created, errorResponse } from '../utils/response';

const ip = () => prisma as never as {
  insurancePolicy: { findMany: (a: unknown) => Promise<unknown[]>; create: (a: unknown) => Promise<unknown> };
  insuranceClaim: { findMany: (a: unknown) => Promise<unknown[]>; create: (a: unknown) => Promise<unknown>; update: (a: unknown) => Promise<unknown> };
};

export const getPolicies = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query as Record<string, string>;
    const policies = await ip().insurancePolicy.findMany({
      where: patientId ? { patientId } : {},
      include: { patient: { select: { name: true } } },
      orderBy: { validTo: 'desc' },
    });
    return ok(res, policies);
  } catch (err) { return errorResponse(res, err, 'getPolicies'); }
};

export const createPolicy = async (req: Request, res: Response) => {
  try {
    console.log('[createPolicy] Request body:', req.body);
    const policy = await ip().insurancePolicy.create({ data: req.body });
    return created(res, policy);
  } catch (err) { return errorResponse(res, err, 'createPolicy'); }
};

export const getClaims = async (req: Request, res: Response) => {
  try {
    const { status } = req.query as Record<string, string>;
    const claims = await ip().insuranceClaim.findMany({
      where: status ? { status } : {},
      include: { bill: { include: { patient: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return ok(res, claims);
  } catch (err) { return errorResponse(res, err, 'getClaims'); }
};

export const createClaim = async (req: Request, res: Response) => {
  try {
    console.log('[createClaim] Request body:', req.body);
    const claim = await ip().insuranceClaim.create({ data: req.body });
    return created(res, claim);
  } catch (err) { return errorResponse(res, err, 'createClaim'); }
};

export const updateClaimStatus = async (req: Request, res: Response) => {
  try {
    const { status, response } = req.body;
    const claim = await ip().insuranceClaim.update({
      where: { id: req.params.id },
      data: {
        status,
        response,
        ...(status === 'SUBMITTED' ? { submittedAt: new Date() } : {}),
        ...(status === 'PAID' ? { paidAt: new Date() } : {}),
      },
    });
    return ok(res, claim);
  } catch (err) { return errorResponse(res, err, 'updateClaimStatus'); }
};

export const deletePolicy = async (req: Request, res: Response) => {
  try {
    const ipr = prisma as never as { insurancePolicy: { delete: (a: unknown) => Promise<unknown> } };
    await ipr.insurancePolicy.delete({ where: { id: req.params.id } });
    return ok(res, null, 'Policy deleted successfully');
  } catch (err) { return errorResponse(res, err, 'deletePolicy'); }
};

export const deleteClaim = async (req: Request, res: Response) => {
  try {
    const ipr = prisma as never as { insuranceClaim: { delete: (a: unknown) => Promise<unknown> } };
    await ipr.insuranceClaim.delete({ where: { id: req.params.id } });
    return ok(res, null, 'Claim deleted successfully');
  } catch (err) { return errorResponse(res, err, 'deleteClaim'); }
};
