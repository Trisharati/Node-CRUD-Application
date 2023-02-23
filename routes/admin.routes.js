const router = require('express').Router();
const multer = require('multer')
const path = require('path')

const adminController = require('../controllers/admin.controller')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname +
          ' ' +
          Date.now() +
          'myimg' +
          path.extname(file.originalname)
      )
    },
  })
  
  const maxSize = 1 * 1024 * 1024
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('Only jpg,png and jpeg type are allowed'))
      }
    },
    limits: maxSize,
  })

  router.get('/', adminController.showIndex);
  router.get('/dashboard',adminController.userAuth, adminController.dashboard);
  router.get('/template', adminController.template);
  router.get('/getRegister',adminController.getRegister)
  router.post('/register',upload.single('image'),adminController.register)
  router.post('/login',adminController.login)
  router.get('/logout',adminController.logout)

  

module.exports = router;