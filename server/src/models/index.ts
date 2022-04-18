import { Sequelize } from 'sequelize-typescript';
import Config from '../config/config';

export * from './Ride.model';
export * from './notification.model';
export * from './notification.model';
export * from './Setting.model';
export * from './TimeSlot.model';
export * from './verification.model';
export * from './User.model';

const ENV_DEV = 'development';

const env: string = process.env.NODE_ENV || ENV_DEV;
const config = Config[env];

// Detect models and import them to the orm
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const modelMatch = (filename, member) => filename.substring(0, filename.indexOf('.model')).toLowerCase() === member.toLowerCase();
// eslint-disable-next-line import/no-mutable-exports
let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.addModels([`${__dirname}/*.model.*`], modelMatch);

// eslint-disable-next-line object-shorthand
export default sequelize;
