import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { RegionService } from '../service/region.service';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';

export class RegionController {
    constructor(@Inject() private regionService: RegionService) {}

    async createRegion(req: Request, res: Response): Promise<void> {
        try {
            const regionData: CreateRegionDto = req.body;
            const region = await this.regionService.createRegion(regionData);
            res.status(201).json({ success: true, data: region });
        } catch (error) {
            console.error('Error creating region:', error);
            res.status(500).json({ success: false, message: 'Failed to create region' });
        }
    }

    async getAllRegions(req: Request, res: Response): Promise<void> {
        try {
            const regions = await this.regionService.findAllRegions();
            res.json({ success: true, data: regions });
        } catch (error) {
            console.error('Error fetching regions:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch regions' });
        }
    }

    async getRegionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const region = await this.regionService.findRegionById(id);
            if (!region) {
                res.status(404).json({ success: false, message: 'Region not found' });
                return;
            }
            res.json({ success: true, data: region });
        } catch (error) {
            console.error('Error fetching region:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch region' });
        }
    }

    async getRegionsByCountry(req: Request, res: Response): Promise<void> {
        try {
            const { countryId } = req.params;
            const regions = await this.regionService.findRegionsByCountry(countryId);
            res.json({ success: true, data: regions });
        } catch (error) {
            console.error('Error fetching regions by country:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch regions' });
        }
    }

    async updateRegion(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateRegionDto = req.body;
            const region = await this.regionService.updateRegion(id, updateData);
            if (!region) {
                res.status(404).json({ success: false, message: 'Region not found' });
                return;
            }
            res.json({ success: true, data: region });
        } catch (error) {
            console.error('Error updating region:', error);
            res.status(500).json({ success: false, message: 'Failed to update region' });
        }
    }

    async deleteRegion(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.regionService.deleteRegion(id);
            if (!deleted) {
                res.status(404).json({ success: false, message: 'Region not found' });
                return;
            }
            res.json({ success: true, message: 'Region deleted successfully' });
        } catch (error) {
            console.error('Error deleting region:', error);
            res.status(500).json({ success: false, message: 'Failed to delete region' });
        }
    }
}
