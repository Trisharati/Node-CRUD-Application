const adminModel = require('../models/admin.model.js')
const addUserModel = require('../models/addUser.model.js')
const faqModel = require('../models/faq.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs');

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
        title : 'Admin || Register'
      })
    }catch(err){
      throw err
    }
  }

  async table_view(req,res){
    try{
      let table_data = await adminModel.find({})
      res.render('admin/tableView',{
        title : 'Admin || User Data',
        table_data,
        user:req.user,
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
      })
    }catch(err){
      throw err
    }
  }

async editUser(req,res){
  try {
    let student_data = await adminModel.find({_id:req.params.id})
    console.log(student_data);
    res.render('admin/edit.ejs',{
      title  :'Edit || Page',
      response : student_data[0],
    })
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
    })
  }catch(err){
    throw err
  }
}

/* To render edit FAQ page */
async faqEdit(req, res) {
  try {
    let faqData = await faqModel.find({ _id: req.params.id });
    console.log(Data, 'faqData');
    res.render('admin/faqEdit.ejs', {
      title: 'FAQ || Edit',
      message: req.flash('message'),
      user: req.user,
      response: faqData[0]
    })
  } catch (err) {
    throw err;
  }
}

async faqUpdate(req, res) {
  try {
    // let data = await AdminFaq.find({_id: req.body.id});
    let questUpdate = await faqModel.findByIdAndUpdate(req.body.id, req.body);
    console.log(req.body, "req.body");
    console.log(questUpdate, "questUpdate");
    if (questUpdate && questUpdate._id) {
      console.log('FAQ Updated');
      req.flash('message', 'Data Updated!!');
      res.redirect('/admin/faq');
    } else {
      console.log('FAQ not updated');
      req.flash('message', 'Data Not Updated!');
      res.redirect('/admin/faq');
    }
  }
  catch (err) {
    throw err;
  }
}

/*To add new FAQ*/
async FAQform(req,res){
  try {
    res.render('admin/faqform.ejs',{
      title : 'FAQ || Form',
      user:req.user,})
  } catch (error) {
    throw error
  }
}

async postFAQ(req,res){
  try {
    
    req.body.question = req.body.question.trim();
    req.body.answer = req.body.answer.trim();

    if (req.body.question || req.body.answer) {
      let faqData = await faqModel.create(req.body);
      if (faqData && faqData._id) {
        req.flash('message', 'Data Entered Successful!!');
        res.redirect('/admin/faq');
      } else {
        req.flash('message', 'Data entry Not Successful!!');
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

async update(req,res){
  try {
    // let isEmailExist = await adminModel.findOne({
    //   email:req.body.email,
    //   _id:{$ne:req.body.id}
    // })
    // if(!isEmailExist){
    //   let isPhoneExist = await adminModel.findOne({
    //     phone: req.body.phone,
    //     _id:{$ne : req.body.id}
    //   })
    //   if(!isPhoneExist){
console.log('hello');
      let data = await adminModel.find({ _id: req.body.id });
      
        let student_update = await adminModel.findByIdAndUpdate(req.body.id,req.body)
        if (req.file && req.file.filename) {
          
          fs.unlinkSync(`./public/uploads/${data[0].image}`)
        

        if(student_update && student_update._id){
          console.log('Details are updated');
          res.redirect('/admin/table_view')
        }
      
              else{
          console.log('Details are not updated');
          res.redirect('/admin/table_view')
        }
      }
    //   }
    //   else{
    //     console.log('Phone number already exists');
    //     res.redirect('/admin/table_view')
    //   }
    // }
    //   else{
    //     console.log('Email id already exists');
    //     res.redirect('/admin/table_view')
    //   }
    
  } catch (error) {
    throw error
  }
}

async delete(req,res){
  try {
    let deletedata = await adminModel.findByIdAndRemove(req.params.id)
    if(deletedata){
      console.log('User deleted successfully');
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
          // req.flash('maessage','Registration successful')
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
      console.log(isUserExist.email);
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
        res.redirect('/admin/dashboard')
        }
        else{
          console.log('Wrong Password');
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
          // req.flash('maessage','Registration successful')
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

  async logout(req,res){
    try{    
      res.clearCookie('userToken');
      console.log('Cookie cleared');
      res.redirect('/admin');
    }
    catch(error){
throw error
    }
  }

}

module.exports = new AdminController();
