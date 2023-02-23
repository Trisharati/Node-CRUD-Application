const adminModel = require('../models/admin.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const variable = require('connect-flash');
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
          },'MED849SDI',{expiresIn : '5m'})
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
