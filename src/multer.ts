import { randomBytes } from 'crypto';
import { diskStorage } from 'multer';
import { resolve } from 'path';

export const config = {
  storage: diskStorage({
    destination: resolve(__dirname, '..', 'uploads'),
    filename(req, file, cb) {
      const hash = randomBytes(16).toString('hex');

      const filename = `${hash}__${file.originalname}`;

      cb(null, filename);
    },
  }),
};
