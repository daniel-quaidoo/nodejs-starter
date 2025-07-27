import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { CityService } from '../service/city.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';

export class CityController {
    constructor(@Inject() private cityService: CityService) {}

    async createCity(req: Request, res: Response): Promise<void> {
        try {
            const cityData: CreateCityDto = req.body;
            const city = await this.cityService.createCity(cityData);
            res.status(201).json({ success: true, data: city });
        } catch (error) {
            console.error('Error creating city:', error);
            res.status(500).json({ success: false, message: 'Failed to create city' });
        }
    }

    async getAllCities(req: Request, res: Response): Promise<void> {
        try {
            const cities = await this.cityService.findAllCities();
            res.json({ success: true, data: cities });
        } catch (error) {
            console.error('Error fetching cities:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch cities' });
        }
    }

    async getCityById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const city = await this.cityService.findCityById(id);
            if (!city) {
                res.status(404).json({ success: false, message: 'City not found' });
                return;
            }
            res.json({ success: true, data: city });
        } catch (error) {
            console.error('Error fetching city:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch city' });
        }
    }

    async getCitiesByRegion(req: Request, res: Response): Promise<void> {
        try {
            const { regionId } = req.params;
            const cities = await this.cityService.findCitiesByRegion(regionId);
            res.json({ success: true, data: cities });
        } catch (error) {
            console.error('Error fetching cities by region:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch cities' });
        }
    }

    async updateCity(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateCityDto = req.body;
            const city = await this.cityService.updateCity(id, updateData);
            if (!city) {
                res.status(404).json({ success: false, message: 'City not found' });
                return;
            }
            res.json({ success: true, data: city });
        } catch (error) {
            console.error('Error updating city:', error);
            res.status(500).json({ success: false, message: 'Failed to update city' });
        }
    }

    async deleteCity(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.cityService.deleteCity(id);
            if (!deleted) {
                res.status(404).json({ success: false, message: 'City not found' });
                return;
            }
            res.json({ success: true, message: 'City deleted successfully' });
        } catch (error) {
            console.error('Error deleting city:', error);
            res.status(500).json({ success: false, message: 'Failed to delete city' });
        }
    }
}
