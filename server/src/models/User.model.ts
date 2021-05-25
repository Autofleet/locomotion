import {
    Table, Column, Model, PrimaryKey, DataType,Unique,IsEmail
  } from 'sequelize-typescript';

  @Table({
    timestamps: true,
    paranoid: true,
  })
  export class User extends Model<User> {
    @PrimaryKey
    @Column({
      defaultValue: DataType.UUIDV4,
      type: DataType.UUID,
    })
    id: string;

    @Column({
      type: DataType.STRING,
    })
    firstName: string;

    @Column({
      type: DataType.STRING,
    })
    lastName: string;

    @Unique
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

    @Unique
    @IsEmail
    @Column
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

