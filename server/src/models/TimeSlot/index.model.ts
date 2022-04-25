import {
  Table, Column, Model, PrimaryKey, DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'time-slots',
})
export default class TimeSlot extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
    id: string;

  @Column({
    type: DataType.STRING,
  })
    timezone: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    dayInWeek: string;

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
