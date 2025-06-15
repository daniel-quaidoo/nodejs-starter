"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * Validates a DTO (Data Transfer Object)
 * @param dtoClass The DTO class to validate
 * @returns A middleware function that validates the DTO
 */
async function validateDto(dtoClass) {
    return async (req, res, next) => {
        const dto = (0, class_transformer_1.plainToClass)(dtoClass, req.query);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        req.query = dto;
        next();
    };
}
//# sourceMappingURL=validator.js.map