import { ClassConstructor, plainToInstance } from 'class-transformer';

function snakeToCamel(str: string): string {
    return str.replace(/(_\w)/g, match => match[1].toUpperCase());
}

function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export abstract class BaseMapper<T> {
    protected abstract get ContractClass(): ClassConstructor<T>;
    protected abstract set ContractClass(value: ClassConstructor<T>);

    constructor() {
        Object.defineProperty(this, 'ContractClass', {
            enumerable: false,
            configurable: true,
            writable: true,
        });
    }

    toContract(): T {
        const result: any = {};
        for (const [key, value] of Object.entries(this)) {
            const camelKey = snakeToCamel(key);
            result[camelKey] = value;
        }
        return plainToInstance(this.ContractClass, result);
    }

    static fromContract<T extends BaseMapper<U>, U>(this: new () => T, contract: any): T | any {
        const result: any = {};

        for (const [key, value] of Object.entries(contract)) {
            const snakeKey = camelToSnake(key);
            result[snakeKey] = value;
        }

        return plainToInstance(this as any, result);
    }
}
