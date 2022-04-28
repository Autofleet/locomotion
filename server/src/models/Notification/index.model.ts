import {
  Table, Column, Model, PrimaryKey, DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'notifications',
  paranoid: true,
})
export default class Notification extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
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
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
    type: string;

  @Column({
    type: DataType.DATE,

  })
    createdAt: string;

  @Column({
    type: DataType.DATE,

  })
    updatedAt: string;
}
