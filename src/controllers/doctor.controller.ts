import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ok, created, notFound, errorResponse } from '../utils/response';

export const getDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { user: { select: { name: true, email: true, phone: true, avatar: true } } },
    });
    return ok(res, doctors);
  } catch (err) {
    return errorResponse(res, err, 'getDoctors');
  }
};

export const getDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true, phone: true, avatar: true } },
        appointments: { where: { status: 'CONFIRMED' }, include: { patient: true }, take: 10 },
      },
    });
    if (!doctor) return notFound(res, 'Doctor not found');
    return ok(res, doctor);
  } catch (err) {
    return errorResponse(res, err, 'getDoctor');
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    console.log('[createDoctor] Request body:', req.body);
    const { userId, specialty, experienceYears, roomNumber, bio } = req.body;
    const doctor = await prisma.doctor.create({ data: { userId, specialty, experienceYears, roomNumber, bio } });
    return created(res, doctor);
  } catch (err) {
    return errorResponse(res, err, 'createDoctor');
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    console.log('[updateDoctor] Request body:', req.body);
    const doctor = await prisma.doctor.update({ where: { id: req.params.id }, data: req.body });
    return ok(res, doctor);
  } catch (err) {
    return errorResponse(res, err, 'updateDoctor');
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    await prisma.doctor.delete({ where: { id: req.params.id } });
    return ok(res, null, 'Doctor deleted successfully');
  } catch (err) {
    return errorResponse(res, err, 'deleteDoctor');
  }
};
