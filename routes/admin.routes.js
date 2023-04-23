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
  router.get('/table_view',upload.single('image'),adminController.table_view)
  router.get('/edit/:id',adminController.editUser)
  router.post('/update_user',upload.single('image'),adminController.update)
  router.get('/delete/:id',adminController.delete)
  router.get('/addUser',adminController.addUser)
  router.post('/add',upload.single('image'),adminController.add)

  /*FAQ Routes */
  router.get('/faq',adminController.faq_view)
  router.get('/FAQform',adminController.FAQform)
  router.post('/postFAQ',adminController.postFAQ)
  router.get('/faqEdit/:id',adminController.userAuth,adminController.faqEdit)
  router.post('/faqUpdate',adminController.faqUpdate)
  router.get('/deleteFAQ/:id',adminController.deleteFAQ)

 
  /*Blog Segment */
  router.get('/blogForm',adminController.blogForm)
  router.get('/blogView',adminController.blogView)
  router.post('/postBlog',upload.single('image'),adminController.postBlog)
  router.get('/editBlog/:id',adminController.userAuth,adminController.editBlog)
  router.post('/updateBlog',upload.single('image'),adminController.updateBlog)
  router.get('/deleteBlog/:id',adminController.deleteBlog)

module.exports = router;