import { Router } from 'express';

const METHODS = [
  'all',
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
];

const AfEntryPoint = func => async (req, res, next) => {
  try {
    await func(req, res, next);
    return true;
  } catch (e) {
    console.log(e.message, e.stack);
    if (e.statusCode && e.statusCode < 500) {
      return res.status(400).json({ error: e.message, status: 'ERROR' });
    }
    return next(e);
  }
};

const AfRouter = (options = {}) => {
  const myRouter = Router({ mergeParams: true, ...options });
  METHODS.map((method) => {
    const internalMethod = myRouter[method].bind(myRouter);
    myRouter[method] = (...args) => {
      internalMethod(...args.map((arg, index) => {
        if (index === 0) {
          return arg;
        }
        return AfEntryPoint(arg);
      }));
    };
    return true;
  });
  return myRouter;
};

export default AfRouter;
