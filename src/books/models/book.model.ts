import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { File } from '../../storage/file.model';

export type BookCreationAttrs = {
    author_id: number
    name: string
}

@Table({ tableName: 'Books' })
export class Book extends Model<Book, BookCreationAttrs> {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare author_id?: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;


    @BelongsTo(() => User, { as: 'author', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    author?: User;

    @HasMany(() => File)
    files?: File[];
}
