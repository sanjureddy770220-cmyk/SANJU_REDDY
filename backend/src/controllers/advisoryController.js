// backend/src/controllers/advisoryController.js
import * as advisoryService from '../services/advisoryService.js';
import { advisoryInputSchema } from '../schemas/validationSchemas.js';

export async function createAdvisory(req, res, next) {
  try {
    const userId = req.user.id;

    // Validate body parameters
    const validatedInput = advisoryInputSchema.parse(req.body);

    const imageBuffer = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : null;

    console.log(`🌾 Processing new advisory for crop "${validatedInput.crop_name}" at stage "${validatedInput.growth_stage}"...`);

    const advisory = await advisoryService.createAdvisory({
      userId,
      farmId: validatedInput.farm_id,
      cropName: validatedInput.crop_name,
      growthStage: validatedInput.growth_stage,
      symptomDescription: validatedInput.symptom_description,
      imageBuffer,
      mimeType
    });

    res.status(201).json({
      success: true,
      data: advisory,
      message: 'Agricultural Advisory successfully generated.'
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisories(req, res, next) {
  try {
    const userId = req.user.id;
    const { cropName, severity, farmId } = req.query;

    const advisories = await advisoryService.getAdvisoriesByUser(userId, {
      cropName,
      severity,
      farmId
    });

    res.json({
      success: true,
      count: advisories.length,
      data: advisories
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const advisory = await advisoryService.getAdvisoryById(req.params.id, userId);

    if (!advisory) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'Advisory report not found'
      });
    }

    res.json({
      success: true,
      data: advisory
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const deleted = await advisoryService.deleteAdvisory(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'Advisory not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Advisory deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

