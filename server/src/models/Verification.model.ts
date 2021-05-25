import {
    Table, Column, Model, PrimaryKey, DataType,
  } from 'sequelize-typescript';

  @Table({
    timestamps: true,
  })
  export class Verification extends Model<Verification> {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({
      type: DataType.STRING,
    })
    phoneNumber: string;

    @Column({
      type: DataType.STRING,
    })
    externalCode: string;
  }

