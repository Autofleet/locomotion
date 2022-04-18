import {
  Table, Column, Model, PrimaryKey, DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  paranoid: true,
})
export class User extends Model {
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
    type: DataType.STRING,
  })
    firstName: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
    lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    phoneNumber: string;

  @Column({
    type: DataType.STRING,
  })
    refreshTokenId: string;

  @Column({
    type: DataType.STRING,
  })
    avatar: string;

  @Column({
    type: DataType.STRING,
  })
    email: string;

  @Column({
    type: DataType.BOOLEAN,
  })
    active: boolean;

  @Column({
    type: DataType.STRING,
  })
    pushUserId: string;

  @Column({
    type: DataType.STRING,
  })
    pushToken: string;

  @Column({
    type: DataType.STRING,

  })
    deviceType: string;
}
