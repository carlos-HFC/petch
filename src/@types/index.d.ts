import 'express';
import { User } from 'src/user/user.model';

declare module 'express' {
  interface Request {
    user: User;
  }
}