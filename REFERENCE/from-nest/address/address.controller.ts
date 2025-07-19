import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

// services
import { AddressService } from "./address.service";

// gateway dto
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller('address')
export class AddressController {

    constructor(private readonly addressService: AddressService) {}

    @Post()
    create(@Body() dto: CreateAddressDto) {
        return this.addressService.create(dto);
    }

    @Get()
    findAll() {
        return this.addressService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.addressService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
        return this.addressService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.addressService.remove(id);
    }
}