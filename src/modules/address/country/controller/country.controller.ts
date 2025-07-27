import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { CountryService } from '../service/country.service';
import { CreateCountryDto } from '../dto/create-country.dto';
import { UpdateCountryDto } from '../dto/update-country.dto';

export class CountryController {
    constructor(@Inject() private countryService: CountryService) {}

    async createCountry(req: Request, res: Response): Promise<void> {
        try {
            const countryData: CreateCountryDto = req.body;
            const country = await this.countryService.createCountry(countryData);
            res.status(201).json({ success: true, data: country });
        } catch (error) {
            console.error('Error creating country:', error);
            res.status(500).json({ success: false, message: 'Failed to create country' });
        }
    }

    async getAllCountries(req: Request, res: Response): Promise<void> {
        try {
            const countries = await this.countryService.findAllCountries();
            res.json({ success: true, data: countries });
        } catch (error) {
            console.error('Error fetching countries:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch countries' });
        }
    }

    async getCountryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const country = await this.countryService.findCountryById(id);
            if (!country) {
                res.status(404).json({ success: false, message: 'Country not found' });
                return;
            }
            res.json({ success: true, data: country });
        } catch (error) {
            console.error('Error fetching country:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch country' });
        }
    }

    async updateCountry(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateCountryDto = req.body;
            const country = await this.countryService.updateCountry(id, updateData);
            if (!country) {
                res.status(404).json({ success: false, message: 'Country not found' });
                return;
            }
            res.json({ success: true, data: country });
        } catch (error) {
            console.error('Error updating country:', error);
            res.status(500).json({ success: false, message: 'Failed to update country' });
        }
    }

    async deleteCountry(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.countryService.deleteCountry(id);
            if (!deleted) {
                res.status(404).json({ success: false, message: 'Country not found' });
                return;
            }
            res.json({ success: true, message: 'Country deleted successfully' });
        } catch (error) {
            console.error('Error deleting country:', error);
            res.status(500).json({ success: false, message: 'Failed to delete country' });
        }
    }
}
