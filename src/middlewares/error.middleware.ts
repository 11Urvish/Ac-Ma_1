import { Request, Response, NextFunction } from 'express';

const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.log(err);
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
};

export default ErrorMiddleware;