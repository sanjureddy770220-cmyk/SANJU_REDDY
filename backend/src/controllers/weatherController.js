// backend/src/controllers/weatherController.js
import * as weatherService from '../services/weatherService.js';

export async function getWeather(req, res, next) {
  try {
    const { location, soilType } = req.query;
    const weatherData = await weatherService.getLocalizedAgroWeather(location, soilType);
    res.json({ success: true, data: weatherData });
  } catch (err) {
    next(err);
  }
}

