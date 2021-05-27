import {
  Table, Column, Model, PrimaryKey, DataType, CreatedAt, UpdatedAt,
} from 'sequelize-typescript';

  @Table
export class Notification extends Model {
    @PrimaryKey
    @Column({
      defaultValue: DataType.UUIDV4,
      type: DataType.UUID,
    })
    id: string;

    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    userId: string;

    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    rideId: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    type: string;

    @CreatedAt
    @Column({
      type: DataType.DATE,
    })
    createdAt: string;

    @UpdatedAt
    @Column({
      type: DataType.DATE,
    })
    updatedAt: string;
}
