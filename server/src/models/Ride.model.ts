import {
  Table, Column, Model, PrimaryKey, DataType,
} from 'sequelize-typescript';

const _ = require('lodash');

export const states = {
  CREATING: 'creating',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  REJECTED: 'rejected',
  PENDING: 'pending',
};


  @Table
export class Ride extends Model {
    static STATES = states;

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
      type: DataType.ENUM(_.values(states)),
      defaultValue: 'creating',
      allowNull: false,
    })
    state: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    pickupAddress: string;

    @Column({
      type: DataType.DECIMAL,
      allowNull: false,
    })
    pickupLat: number;

    @Column({
      type: DataType.DECIMAL,
      allowNull: false,
    })
    pickupLng: number;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    dropoffAddress: string;

    @Column({
      type: DataType.DECIMAL,
      allowNull: false,
    })
    dropoffLat: number;

    @Column({
      type: DataType.DECIMAL,
      allowNull: false,
    })
    dropoffLng: number;

    @Column({
      type: DataType.INTEGER,
    })
    numberOfPassenger: number;

    @Column({
      type: DataType.DATE,
    })
    completedAt: string;

    @Column({
      type: DataType.DATE,
    })
    canceledAt: string;

    @Column({
      type: DataType.DATE,
    })
    arrivingPush: string;

    @Column({
      type: DataType.DATE,
    })
    scheduledTo: string;

    @Column({
      type: DataType.DATE,
    })
    createdAt: string;

    @Column({
      type: DataType.DATE,
    })
    updatedAt: string;

    @Column({
      type: DataType.INTEGER,
    })
    rating: number;
}
