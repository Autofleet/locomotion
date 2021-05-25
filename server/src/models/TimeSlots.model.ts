import {
    Table, Column, Model, PrimaryKey, DataType,
  } from 'sequelize-typescript';

  @Table({
    timestamps: true,
  })
  export class TimeSlots extends Model<TimeSlots> {
    @PrimaryKey
    @Column({
      defaultValue: DataType.UUIDV4,
      type: DataType.UUID,
    })
    id: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    timezone: string;

    @Column({
        type: DataType.INTEGER,
    })
    dayInWeek: number;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    startTime: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    endTime: string;
  }

