// backend/src/controllers/farmController.js
import * as farmService from '../services/farmService.js';
import { createFarmSchema, updateFarmSchema } from '../schemas/validationSchemas.js';

export async function getFarms(req, res, next) {
  try {
    const userId = req.user.id;
    const farms = await farmService.getFarmsByUser(userId);
    res.json({ success: true, count: farms.length, data: farms });
  } catch (err) {
    next(err);
  }
}

export async function getFarm(req, res, next) {
  try {
    const userId = req.user.id;
    const farm = await farmService.getFarmById(req.params.id, userId);
    if (!farm) {
      return res.status(404).json({ error: 'NotFound', message: 'Farm not found' });
    }
    res.json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
}

export async function createFarm(req, res, next) {
  try {
    const userId = req.user.id;
    const validatedData = createFarmSchema.parse(req.body);

    const farm = await farmService.createFarm({
      userId,
      ...validatedData
    });

    res.status(201).json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
}

export async function updateFarm(req, res, next) {
  try {
    const userId = req.user.id;
    const validatedData = updateFarmSchema.parse(req.body);

    const updated = await farmService.updateFarm(req.params.id, userId, validatedData);
    if (!updated) {
      return res.status(404).json({ error: 'NotFound', message: 'Farm not found or unauthorized' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteFarm(req, res, next) {
  try {
    const userId = req.user.id;
    const deleted = await farmService.deleteFarm(req.params.id, userId);
    if (!deleted) {
      return res.status(404).json({ error: 'NotFound', message: 'Farm not found or unauthorized' });
    }

    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (err) {
    next(err);
  }
}

