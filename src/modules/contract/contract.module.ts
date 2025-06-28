// decorator
import { Module } from '../../core/common/di/module.decorator';

// entity
import { Contract } from './entities/contract.entity';
import { ContractType } from './entities/contract-type.entity';
import { ContractAssignment } from './entities/contract-assignment.entity';

@Module({
    imports: [Contract, ContractType, ContractAssignment],
})
export class ContractModule {}
