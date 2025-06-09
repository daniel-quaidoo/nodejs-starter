"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(entity) {
        return this.repository.create(entity);
    }
    async findAll(options) {
        const [items] = await this.repository.findAndCount(options);
        return items;
    }
    async findAndCount(options) {
        return this.repository.findAndCount(options);
    }
    async findOne(idOrConditions, options) {
        if (typeof idOrConditions === 'object') {
            return this.repository.findOne({
                where: idOrConditions,
                ...options,
            });
        }
        return this.repository.findOne({
            where: { id: idOrConditions },
            ...options,
        });
    }
    async update(idOrConditions, entity) {
        const result = await this.repository.update(idOrConditions, entity);
        return result;
    }
    async delete(idOrConditions) {
        const result = await this.repository.delete(idOrConditions);
        if (typeof result === 'boolean') {
            return result;
        }
        return result.affected ? result.affected > 0 : false;
    }
    async softDelete(idOrConditions) {
        const result = await this.repository.softDelete(idOrConditions);
        if (typeof result === 'boolean') {
            return result;
        }
        return result.affected ? result.affected > 0 : false;
    }
    async count(options) {
        return this.repository.count(options);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map