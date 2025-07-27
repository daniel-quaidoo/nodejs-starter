import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { AddressService } from '../service/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

export class AddressController {
    constructor(@Inject() private addressService: AddressService) {}

    async createAddress(req: Request, res: Response): Promise<void> {
        try {
            const addressData: CreateAddressDto = req.body;
            const address = await this.addressService.createAddress(addressData);
            res.status(201).json({ success: true, data: address });
        } catch (error) {
            console.error('Error creating address:', error);
            res.status(500).json({ success: false, message: 'Failed to create address' });
        }
    }

    async getAllAddresses(req: Request, res: Response): Promise<void> {
        try {
            const addresses = await this.addressService.findAllAddresses();
            res.json({ success: true, data: addresses });
        } catch (error) {
            console.error('Error fetching addresses:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
        }
    }

    async getAddressById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const address = await this.addressService.findAddressById(id);
            if (!address) {
                res.status(404).json({ success: false, message: 'Address not found' });
                return;
            }
            res.json({ success: true, data: address });
        } catch (error) {
            console.error('Error fetching address:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch address' });
        }
    }

    async updateAddress(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateAddressDto = req.body;
            const address = await this.addressService.updateAddress(id, updateData);
            if (!address) {
                res.status(404).json({ success: false, message: 'Address not found' });
                return;
            }
            res.json({ success: true, data: address });
        } catch (error) {
            console.error('Error updating address:', error);
            res.status(500).json({ success: false, message: 'Failed to update address' });
        }
    }

    async deleteAddress(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.addressService.deleteAddress(id);
            if (!deleted) {
                res.status(404).json({ success: false, message: 'Address not found' });
                return;
            }
            res.json({ success: true, message: 'Address deleted successfully' });
        } catch (error) {
            console.error('Error deleting address:', error);
            res.status(500).json({ success: false, message: 'Failed to delete address' });
        }
    }
}
