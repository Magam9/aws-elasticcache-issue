const dotenv = require('dotenv');
const { isFinite, isString, isBoolean, isArray } = require('lodash');
const path = require('path');

const toBoolean = str => {
  return str === 'true';
};

const toArray = str => {
  return str.split(' | ').map(elem => elem.trim());
};

const convertTo = (str, type) => {
  switch (type) {
    case 'number':
      return Number(str);
    case 'string':
      return str;
    case 'boolean':
      return toBoolean(str);
    case 'array':
      return toArray(str);
    default:
      throw new Error('Unknown type.');
  }
};

const isValid = (value, type) => {
  return (
    (type === 'string' && isString(value) && value) ||
    (type === 'number' && isFinite(value)) ||
    (type === 'boolean' && isBoolean(value)) ||
    (type === 'array' && isArray(value))
  );
};

const getEnvOrThrow = (env, name, type) => {
  const strEnVar = env[name];
  if (typeof strEnVar !== 'string') {
    throw new Error(`Env ${name} not defined.`);
  }

  const enVar = convertTo(strEnVar.trim(), type);
  if (!isValid(enVar, type)) {
    throw new Error(`Env ${name} is invalid.`);
  }

  return enVar;
};

const init = () => {
  dotenv.config(path.resolve(__dirname, '../.env'));

  const { env } = process;

  return {
    server: {
      redis: {
        host: getEnvOrThrow(env, 'REDIS_HOST', 'string'),
        port: getEnvOrThrow(env, 'REDIS_PORT', 'number')
      }
    }
  };
};

module.exports = {
  ...init()
};
