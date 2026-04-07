import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ok, created, notFound, badRequest, errorResponse } from '../utils/response';

export const getItems = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search } }];
    if (category) where.category = category;
    const items = await prisma.inventoryItem.findMany({ where, orderBy: { name: 'asc' } });
    return ok(res, items);
  } catch (err) { 
    return errorResponse(res, err, 'getItems'); 
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    console.log('[createItem] Request body:', req.body);
    const item = await prisma.inventoryItem.create({ data: req.body });
    return created(res, item);
  } catch (err) { 
    return errorResponse(res, err, 'createItem'); 
  }
};

export const adjustInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, quantity, reason } = req.body;
    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) return notFound(res, 'Item not found');

    const delta = type === 'IN' ? quantity : type === 'OUT' ? -quantity : quantity;
    const newQty = item.quantity + delta;
    if (newQty < 0) return badRequest(res, 'Insufficient quantity');

    const [updated] = await prisma.$transaction([
      prisma.inventoryItem.update({ where: { id }, data: { quantity: newQty } }),
      prisma.inventoryMovement.create({ data: { itemId: id, type, quantity, reason } }),
    ]);
    return ok(res, updated);
  } catch (err) { 
    return errorResponse(res, err, 'adjustInventory'); 
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    console.log('[updateItem] Request body:', req.body);
    const item = await prisma.inventoryItem.update({ where: { id: req.params.id }, data: req.body });
    return ok(res, item);
  } catch (err) { 
    return errorResponse(res, err, 'updateItem'); 
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id } });
    return ok(res, null, 'Item deleted successfully');
  } catch (err) { 
    return errorResponse(res, err, 'deleteItem'); 
  }
};
