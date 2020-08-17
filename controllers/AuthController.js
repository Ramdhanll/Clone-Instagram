const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'erdevlop@gmail.com',
      pass: 'dhanigantengnomor1'
  }
});


const index = (req, res)  => {
  res.send('Hello bro')
}

const mailOptions = to => {
  return {
    from: 'erdevlop@gmail.com',
    to: to,
    subject: 'Signup Successfully',
    html: '<h1>Congrats your account success register!</h1>'
  }
}

const signup = (req, res) => {

  const {name, email, password, photo} = req.body
  if (!name) return res.status(422).json({error : "the name field is required!"})
  if (!email) return res.status(422).json({error : "the email field is required!"})
  if (!password) return res.status(422).json({error : "the password field is required!"})

  User.find({email : email})
    .then((result) => {
      if(result.length > 0) {
        res.status(422).json({error : "user already exists with that email"})
      } else {
        const user = new User({
          name, email, password, photo
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) throw err
            user.password = hash
            user.save()
            .then((result) => {
              console.log(result, 'result')
              transporter.sendMail(mailOptions(result.email), (err, info) => {
                if (err) {
                  console.log(err)
                };
            });
              res.json({message : "saved successfully"})
            }).catch((err) => {
              res.status(422).json("saved failed")
              console.log(err)
            });
          });
        });
      }
    })
    .catch((err) => {
      console.log(err)
    });
}

const signin = (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(422).json({error : "please add email or password"})
  }
  User.findOne({email : email})
    .then((result) => {
      if(!result) return res.status(422).json({error : "Invalid email or password"})
      bcrypt.compare(password, result.password, (err, isMatch) => {
        if(err) throw err
        if(isMatch) {
          const token = jwt.sign({ _id : result._id }, JWT_SECRET)
          const {_id, name, email, followers, following, photo} = result
          res.json({token, user: {_id, name, email, photo, followers, following}})
        } else {
          res.status(422).json({error : "Invalid email or password"})
        }
      })
    })
    .catch(err => console.log(err))

}

module.exports = {
  index,
  signup,
  signin
}