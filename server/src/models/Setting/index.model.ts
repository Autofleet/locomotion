import {
  Table, Column, Model, PrimaryKey, DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'settings',
  paranoid: true,
})
export default class Setting extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
    id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
    key: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'string',
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
