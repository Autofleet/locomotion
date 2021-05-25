import {
    Table, Column, Model, PrimaryKey, DataType,
  } from 'sequelize-typescript';

  @Table({
    timestamps: true,
  })
  export class Notification extends Model<Notification> {
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

    @Column({
        type: DataType.DATE,
    })
    createdAt: string;

    @Column({
        type: DataType.DATE,
    })
    updatedAt: string;

  }