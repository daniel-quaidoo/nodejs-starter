"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDAO = void 0;
class BaseDAO {
    constructor(dataSource, entity) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.repository = this.dataSource.getRepository(this.entity);
    }
    async create(entity) {
        const newEntity = this.repository.create(entity);
        return this.repository.save(newEntity);
    }
    async findAll(options) {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
    }
    async find(options) {
        const [items] = await this.findAll(options);
        return items;
    }
    async findAndCount(options) {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
    }
    async findOne(idOrOptions) {
        if (typeof idOrOptions === 'string' || typeof idOrOptions === 'number') {
            return this.repository.findOne({
                where: { id: idOrOptions, deletedAt: null },
            });
        }
        if ('where' in idOrOptions) {
            return this.repository.findOne({
                ...idOrOptions,
                where: { deletedAt: null, ...idOrOptions.where },
            });
        }
        return this.repository.findOne({ where: { ...idOrOptions, deletedAt: null } });
    }
    async update(idOrConditions, entity) {
        const updateData = {
            ...entity,
            updatedAt: new Date(),
        };
        if (typeof idOrConditions === 'string' || typeof idOrConditions === 'number') {
            const result = await this.repository.update(idOrConditions, updateData);
            if (!result.affected) {
                return null;
            }
            return this.findOne(idOrConditions);
        }
        const updateResult = await this.repository.update(idOrConditions, updateData);
        if (!updateResult.affected) {
            return null;
        }
        return this.repository.findOne({ where: idOrConditions });
    }
    async delete(idOrConditions) {
        return this.softDelete(idOrConditions);
    }
    async softDelete(idOrConditions) {
        return this.repository.softDelete(idOrConditions);
    }
    async count(options) {
        return this.repository.count({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
    }
}
exports.BaseDAO = BaseDAO;
//# sourceMappingURL=base.dao.js.map