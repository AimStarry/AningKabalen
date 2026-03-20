import jwt from 'jsonwebtoken';

export const signToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as jwt.SignOptions);

export const respond = (res: any, statusCode: number, data: object) =>
  res.status(statusCode).json({ success: true, ...data });
