const DataTypes = {
  ENUM: () => {},
};

const target = `{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  key: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  value: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  type: {
    allowNull: true,
    type: DataTypes.ENUM('string', 'number', 'json', 'boolean'),
    defaultValue: 'string',
  },
}`;

const findValue = (str, lookFor) => {
  const keyStr = `${lookFor}:`;
  const startIndex = str.indexOf(keyStr);
  if (startIndex < 0) {
    return null;
  }
  const endIndex = str.indexOf(',', startIndex) || str.indexOf('}', startIndex);
  return str.substring(startIndex, endIndex).replace(keyStr, '').trim();
};

// eslint-disable-next-line prefer-const
let targetJs = {};
eval(`targetJs = ${target}`);

const columns = Object.keys(targetJs);
const classString = `
@Table({
tableName: 'rides'
})
export class Ride extends Model {
    ${columns.map((column, i) => {
    const startIndex = target.indexOf(column);
    const endIndex = columns[i + i] ? target.indexOf(columns[i + i]) : target.length;
    console.log(target.substring(startIndex, endIndex));
    const jsonTarget = target.substring(startIndex, endIndex);
    const allowNull = findValue(jsonTarget, 'allowNull');
    const sequelizeType = findValue(jsonTarget, 'type');
    const defaultValue = findValue(jsonTarget, 'defaultValue');
    return `
        @Column({
            type: ${sequelizeType},
            ${defaultValue ? `defaultValue: ${defaultValue},` : ''}
            ${allowNull ? `allowNull: ${allowNull},` : ''}
          })
          ${column}: string;
        `;
  }).join(' ')}
}`;

console.log(classString);
