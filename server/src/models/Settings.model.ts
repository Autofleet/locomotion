import {
    Table, Column, Model, PrimaryKey, DataType,
  } from 'sequelize-typescript';

  @Table({
    timestamps: true,
  })
  export class Settings extends Model<Settings> {
    @PrimaryKey
    @Column({
      allowNull: false,
      autoIncrement: true,
      type: DataType.INTEGER,

    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    key: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    value: string;

    @Column({
      type: DataType.ENUM('string', 'number', 'json', 'boolean'),
      defaultValue: 'string',
      allowNull: false,
    })
    type: string;
  }

