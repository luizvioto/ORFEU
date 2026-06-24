import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage: storage });