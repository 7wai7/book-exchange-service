import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Book } from '../books/models/book.model';
import { User } from '../user/models/user.model';

export type FileField = "book" | "cover";

export type FileCreationAttrs = {
    book_id?: number;
    user_id?: number;
    field: FileField;
    originalName: string;
    filename: string; // те, що зберігається на диску / хмарі
    mime: string;
    size: number;
    url: string; // шлях на диску або хмари
};

@Table({ tableName: 'Files', timestamps: true })
export class File extends Model<File, FileCreationAttrs> {
    @ForeignKey(() => Book)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare book_id?: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare user_id?: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare field: string; // 'cover' | 'book'

    @Column({ type: DataType.STRING, allowNull: false })
    declare originalName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare filename: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare mime: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare size: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare url: string;

    @BelongsTo(() => Book, { onDelete: 'CASCADE' })
    book?: Book;
}
