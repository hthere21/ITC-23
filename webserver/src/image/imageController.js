const multer = require('multer');
const path = require('path');

// configure storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// create upload middleware using Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // limit file size to 1 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profileImage'); // name of the file input field in the form

// check file type (in this case, we only allow images)
function checkFileType(file, cb) {
  // allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// image upload controller
exports.uploadImage = function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: 'Error: No File Selected!' });
      } else {
        // save the image URL to the user's profile in the database
        const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
        const userId = req.user._id;
        User.findByIdAndUpdate(userId, { picture: imageUrl }, { new: true }, (err, user) => {
          if (err) {
            res.status(500).json({ message: err });
          } else {
            res.status(200).json({ message: 'File Uploaded Successfully!', imageUrl: imageUrl });
          }
        });
      }
    }
  });
};
