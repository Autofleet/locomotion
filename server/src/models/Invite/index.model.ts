import {
  Table, Column, Model, PrimaryKey, DataType, ForeignKey,
} from 'sequelize-typescript';
import User from '../User/index.model';

export const DEFAULT_INVITE_EXPIRE_TIME_HOURS = 168;

@Table({
  timestamps: true,
  paranoid: true,
})
export default class Invite extends Model {
  @PrimaryKey
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
    id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
    userId: string;

  @Column
    sentAt: Date;

  @Column
    approvedAt: Date;
}
