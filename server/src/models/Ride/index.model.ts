import {
  Table, Column, Model, PrimaryKey, DataType,
} from 'sequelize-typescript';

const states = {
  CREATING: 'creating',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

@Table({
  tableName: 'rides',
  paranoid: true,
})
export default class Ride extends Model {
  static STATES = states;

    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    })
      id: string;

    @Column({
      type: DataType.UUID,
    })
      operationId: string;

    @Column({
      type: DataType.UUID,
      defaultValue: 'creating',
    })
      userId: string;

    @Column({
      type: DataType.ENUM(...Object.values(states)),
      defaultValue: 'creating',
    })
      state: string;

    @Column({
      type: DataType.STRING,
    })
      pickupAddress: string;

    @Column({
      type: DataType.DECIMAL,
    })
      pickupLat: string;

    @Column({
      type: DataType.DECIMAL,
    })
      pickupLng: string;

    @Column({
      type: DataType.STRING,
    })
      dropoffAddress: string;

    @Column({
      type: DataType.DECIMAL,
    })
      dropoffLat: string;

    @Column({
      type: DataType.DECIMAL,
    })
      dropoffLng: string;

    @Column({
      type: DataType.INTEGER,
    })
      numberOfPassenger: string;

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
      createdAt: string;

    @Column({
      type: DataType.DATE,
    })
      updatedAt: string;

    @Column({
      type: DataType.DATE,
    })
      arrivingPush: string;

    @Column({
      type: DataType.DATE,
    })
      scheduledTo: string;

    @Column({
      type: DataType.INTEGER,
    })
      rating: number;
}
