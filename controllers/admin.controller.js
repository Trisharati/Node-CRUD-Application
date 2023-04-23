const adminModel = require('../models/admin.model.js')
const addUserModel = require('../models/addUser.model.js')
const faqModel = require('../models/faq.model.js')
const blogModel = require('../models/blog.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const fs = require('fs');

class AdminController {
  constructor() {}

  /**
   * @Method showIndex
   * @Description To Show The Index Page / Login Page
   */
  async showIndex(req, res) {
    try {
      res.render("admin/index", {
        title: "Admin || Login",
        message: req.flash('message')
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method dashboard
   * @Description To Show The Dashboard
   */
  async dashboard(req, res) {
    try {
      res.render("admin/dashboard", {
        title: "Admin || Dashboard",
        user:req.user,
        message: req.flash('message')
      })
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method template
   * @Description Basic Template
   */
   async template(req, res) {
    try {
      res.render("admin/template", {
        title: "Admin || Template"
      })
    } catch (err) {
      throw err;
    }
  }

  

  async userAuth(req,res,next){
    try {
      if(req.user){
        next()
      }
      else{
        res.redirect('/admin')
      }
    } catch (error) {
      throw error
    }
  }
  async getRegister(req,res){
    try{
      res.render('admin/register',{
        title : 'Admin || Register',
        message: req.flash('message')
      })
    }catch(err){
      throw err
    }
  }

 

  async register(req,res){
    try {
      
      console.log(req.file);
      req.body.image = req.file.filename
      
      let isEmailExist = await adminModel.findOne({email:req.body.email})
      if(!isEmailExist){
      if(req.body.password === req.body.confirmPassword){
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        )
        let saveData = await adminModel.create(req.body)
        if(saveData && saveData._id){
          console.log(saveData);
          req.flash('message','Registration successful')
          console.log('Registered');
          res.redirect('/admin')
        }
        else{
          console.log('Not registered');
          res.redirect('/admin/getRegister')
        }
      }
      else{
        console.log('Password and confirm password does not match');
        res.redirect('/admin/getRegister')
      }
    }
    else{
      console.log('Email already exists');
      res.redirect('/admin/getRegister')
    }
    } catch (error) {
      throw error
    }
  }

  async login(req,res){
    try {
      
      let isUserExist = await adminModel.findOne({
        email : req.body.email,
        
      })
      if(isUserExist){
        
        const hashPassword = isUserExist.password
        if(bcrypt.compareSync(req.body.password,hashPassword)){
          const token = jwt.sign({
            id : isUserExist._id,
            email : isUserExist.email,
            name : `${isUserExist.firstName} ${isUserExist.lastName}`,
            image : isUserExist.image
          },'MED849SDI',{expiresIn : '1h'})
        console.log('Login successful');
        res.cookie('userToken',token)
        req.flash('message','Login successful')
        res.redirect('/admin/dashboard')
        }
        else{
          console.log('Wrong Password');
          req.flash('message','Login not successful')
          res.redirect('/admin')
        }
      }
      else{
        console.log('Email does not exist');
        res.redirect('/admin')
      }
    } catch (error) {
      throw error
    }
  }
  async table_view(req,res){
    try{
      let table_data = await addUserModel.find({})
      res.render('admin/tableView',{
        title : 'Admin || User Data',
        table_data,
        user:req.user,
        message: req.flash('message')
      })
    }catch(err){
      throw err
    }
  }

  async addUser(req,res){
    try{
      res.render('admin/addUser',{
        title : 'Admin || Add User',
        user:req.user,
        message: req.flash('message')
      })
    }catch(err){
      throw err
    }
  }

  async editUser(req,res){
    try {
      let student_data = await addUserModel.find({_id:req.params.id})
      console.log(student_data);
      res.render('admin/edit.ejs',{
        title  :'Edit || Page',
        response : student_data[0],
        message: req.flash('message')
      })
    } catch (error) {
      throw error
    }
  }

/*Add New User*/
async add(req,res){
  try {
    
    console.log(req.file);
    req.body.image = req.file.filename
    
    let isEmailExist = await addUserModel.findOne({email:req.body.email})
    if(!isEmailExist){
    if(req.body.password === req.body.confirmPassword){
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      )
      let saveData = await addUserModel.create(req.body)
      if(saveData && saveData._id){
        console.log(saveData);
        req.flash('message','New user added successfully')
        console.log('User added successfully');
        res.redirect('/admin/table_view')
      }
      else{
        console.log('User not added');
        res.redirect('/admin/table_view')
      }
    }
    else{
      console.log('Password and confirm password does not match');
      res.redirect('/admin/table_view')
    }
  }
  else{
    console.log('Email already exists');
    res.redirect('/admin/addUser')
  }
  } catch (error) {
    throw error
  }
}
async update(req,res){
  try {
    
    let isEmailExist = await addUserModel.findOne({
      email:req.body.email,
      _id:{$ne:req.body.id}
    })
    if(!isEmailExist){
      if(req.file){
        req.body.image = req.file.filename
      }
      let isPhoneExist = await addUserModel.findOne({
        phone: req.body.phone,
        _id:{$ne : req.body.id}
      })
      if(!isPhoneExist){
        
      let data = await addUserModel.find({ _id: req.body.id });
      if (req.file && req.body.filename) {
          
        fs.unlinkSync(`./public/uploads/${data[0].image}`)
      }
        let student_update = await addUserModel.findByIdAndUpdate(req.body.id,req.body)
         if(student_update && student_update._id){
          console.log('Details are updated');
          req.flash('message','User updated successfully')
          res.redirect('/admin/table_view')
        }
      
              else{
          console.log('Details are not updated');
          res.redirect('/admin/table_view')
        }
      }
      
      else{
        console.log('Phone number already exists');
        res.redirect('/admin/table_view')
      }
    }
    else{
        console.log('Email id already exists');
        res.redirect('/admin/table_view')
      }
    
  } catch (error) {
    throw error
  }
}

async delete(req,res){
  try {
    let deletedata = await addUserModel.findByIdAndRemove(req.params.id)
    if(deletedata){
      console.log('User deleted successfully');
      req.flash('message','User deleted successfully')
      res.redirect('/admin/table_view')
    }
    else{
      console.log('User not deleted');
      res.redirect('/admin/table_view')
    }
  } catch (error) {
    throw error
  }
}

  async logout(req,res){
    try{    
      res.clearCookie('userToken');
      console.log('Cookie cleared');
      req.flash('message','Logged out')
      res.redirect('/admin');
    }
    catch(error){
throw error
    }
  }

  /*To add new FAQ*/
async FAQform(req,res){
  try {
    res.render('admin/faqform.ejs',{
      title : 'FAQ || Form',
      user:req.user,
      message:req.flash('message')})
  } catch (error) {
    throw error
  }
}
/* To see existing FAQ list */

async faq_view(req,res){
  try{
    let faqData = await faqModel.find({ isDeleted: false });
    
    res.render('admin/faq_view',{
      title : 'Admin || FAQ',
      user:req.user,
      faqData,
      message:req.flash('message')
    })
  }catch(err){
    throw err
  }
}

/* To render edit FAQ page */
async faqEdit(req, res) {
  try {
    let faqData = await faqModel.find({ _id: req.params.id });
    res.render('admin/faqEdit.ejs', {
      title: 'FAQ || Edit',
      user: req.user,
      response: faqData[0]
    })
  } catch (err) {
    throw err;
  }
}
async postFAQ(req,res){
  try {
    
    req.body.question = req.body.question.trim();
    req.body.answer = req.body.answer.trim();

    if (req.body.question || req.body.answer) {
      let faqData = await faqModel.create(req.body);
      if (faqData && faqData._id) {
        req.flash('message', 'FAQ Entered Successfully!!');
        console.log('FAQ added successfully');
        console.log(faqData);
        res.redirect('/admin/faq');
      } else {
        req.flash('message', 'FAQ entry Not Successful!!');
        console.log('FAQ not added');
        res.redirect('/admin/faq');
      }
    }else{
      req.flash('message', "Field Should Not Be Empty!!");
      res.redirect('/admin/FAQform');
    }
  } catch (error) {
    throw error
  }
}
async faqUpdate(req, res) {
  try {
   
    let questUpdate = await faqModel.findByIdAndUpdate(req.body.id, req.body);
    if (questUpdate && questUpdate._id) {
      console.log('FAQ Updated');
      req.flash('message', 'FAQ Updated!!');
      res.redirect('/admin/faq');
    } else {
      console.log('FAQ not updated');
      req.flash('message', 'FAQ Not Updated!');
      res.redirect('/admin/faq');
    }
  }
  catch (err) {
    throw err;
  }
}

async deleteFAQ(req,res){
  try {
    let deletedata = await faqModel.findByIdAndRemove(req.params.id)
    if(deletedata){
      console.log('FAQ deleted successfully');
      req.flash('message','FAQ deleted successfully')
      res.redirect('/admin/faq')
    }
    else{
      console.log('FAQ not deleted');
      req.flash('message','FAQ not deleted')
      res.redirect('/admin/faq')
    }
  } catch (error) {
    throw error
  }
}
/*End of FAQ segment*/

/* Start of Blog segment */
async blogForm(req,res){
  try{
    res.render('admin/blogForm.ejs',{
      title : 'Admin || Add Blog',
      user:req.user,
    })
  }catch(err){
    throw err
  }
}

async blogView(req,res){
  try{
    let blogData = await blogModel.find({ isDeleted: false });
    
    res.render('admin/blogView.ejs',{
      title : 'Admin || Blog View',
      user:req.user,
      blogData,
      message:req.flash('message')
    })
  }catch(err){
    throw err
  }
}

/* To render edit Blog page */
async editBlog(req, res) {
  try {
    let blogData = await blogModel.find({ _id: req.params.id });
    res.render('admin/editBlog.ejs', {
      title: 'FAQ || Edit',
      user: req.user,
      response: blogData[0]
    })
  } catch (err) {
    throw err;
  }
}

async postBlog(req,res){
  try {
    req.body.image = req.file.filename
    let blogData = await blogModel.create(req.body)
    if(blogData && blogData._id){
      console.log('Blog created')
      req.flash('message','Blog created')
      res.redirect('/admin/blogView')

    }
    else{
      console.log('Blog has not been created');
      req.flash('message','Blog has not been created')
      res.redirect('/admin/blogView')
    }
  } catch (error) {
    throw error
  }
}

async updateBlog(req, res) {
  try {

    let blogData = await blogModel.find({_id:req.body.id})
    if (req.file && req.body.filename) {
          
          fs.unlinkSync(`./public/uploads/${blogData[0].image}`)
        }
        if(req.file){
          req.body.image = req.file.filename
        }
    let blogUpdate = await blogModel.findByIdAndUpdate(req.body.id, req.body);
    if (blogUpdate && blogUpdate._id) {
      console.log('Blog Updated');
      req.flash('message', 'Blog Updated!!');
      res.redirect('/admin/blogView');
    } else {
      console.log('Blog not updated');
      req.flash('message', 'Blog Not Updated!');
      res.redirect('/admin/blogView');
    }
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

async deleteBlog(req,res){
  try {
    let deleteBlog = await blogModel.findByIdAndRemove(req.params.id)
    if(deleteBlog){
      console.log('Blog deleted successfully');
      req.flash('message','Blog deleted successfully')
      res.redirect('/admin/blogView')
    }
    else{
      console.log('Blog not deleted');
      req.flash('message','Blog not deleted')
      res.redirect('/admin/blogView')
    }
  } catch (error) {
    throw error
  }
}

}

module.exports = new AdminController();
