import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ok, created, notFound, errorResponse } from '../utils/response';

export const getPatients = async (req: Request, res: Response) => {
  try {
    const { search, page = '1', limit = '10' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { phone: { contains: search } }] }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.patient.count({ where }),
    ]);

    return ok(res, { patients, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    return errorResponse(res, err, 'getPatients');
  }
};

export const getPatient = async (req: Request, res: Response) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        appointments: { include: { doctor: { include: { user: { select: { name: true } } } } }, orderBy: { appointmentDate: 'desc' }, take: 5 },
        medicalRecords: { include: { doctor: { include: { user: { select: { name: true } } } }, prescriptions: { include: { medicine: true } } }, orderBy: { createdAt: 'desc' }, take: 5 },
        bills: { orderBy: { createdAt: 'desc' }, take: 5 },
        encounters: { orderBy: { createdAt: 'desc' }, take: 5 },
        labOrders: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!patient) return notFound(res, 'Patient not found');
    return ok(res, patient);
  } catch (err) {
    return errorResponse(res, err, 'getPatient');
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    console.log('[createPatient] Request body:', req.body);
    const patient = await prisma.patient.create({ data: req.body });
    return created(res, patient);
  } catch (err) {
    return errorResponse(res, err, 'createPatient');
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    console.log('[updatePatient] Request body:', req.body);
    const patient = await prisma.patient.update({ where: { id: req.params.id }, data: req.body });
    return ok(res, patient);
  } catch (err) {
    return errorResponse(res, err, 'updatePatient');
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    await prisma.patient.delete({ where: { id: req.params.id } });
    return ok(res, null, 'Patient deleted');
  } catch (err) {
    return errorResponse(res, err, 'deletePatient');
  }
};
