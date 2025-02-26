import multer from 'multer';
import path from 'path'

const publicDir = path.resolve(process.cwd(), "temp");

  const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, publicDir); 
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext); 
    },
  });
  
  export const upload = multer({ storage: multerConfig });
  
