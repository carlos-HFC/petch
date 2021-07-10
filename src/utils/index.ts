import { HttpException } from '@nestjs/common';

export function trimObj(obj: object) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') obj[key] = obj[key].trim();
  }
}

export function validateEmail(email: string) {
  const regex = /\S+@\S+\.\S+/;

  if (!regex.test(email)) throw new HttpException('E-mail inválido', 400);
}