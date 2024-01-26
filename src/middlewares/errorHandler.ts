import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";

interface errorType {
  status: number;
  message: string;
}

const errorHandler = (
  error: errorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // DEFAULT ERROR
  let status = 500;
  let data = {
    message: "Internal Server Error",
  };

  if (error instanceof ValidationError) {
    status = 401;
    data.message = error.message;
    return res.status(status).json(data);
  }

  if (error.status) {
    status = error.status;
  }
  if (error.message) {
    data.message = error.message;
  }
  return res.status(status).json(data);
};

export { errorHandler };
