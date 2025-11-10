import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Role, RoleEnum } from '../../enums/role.enum';

export type UserCreationAttrs = {
    username: string;
    email: string;
    password: string;
    role?: Role;
}

@Table({ tableName: 'Users' })
export class User extends Model<User, UserCreationAttrs> {
    @Column({ type: DataType.STRING, allowNull: false })
    declare username: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @Column({ type: RoleEnum, allowNull: false, defaultValue: Role.USER })
    declare role: Role;
}
