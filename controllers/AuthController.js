const User = require('../models/UserModel')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

const mailOptions = (to, html) => {
  return {
    from: 'erdevlop@gmail.com',
    to: to,
    subject: 'Signup Successfully',
    html: html
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
              transporter.sendMail(mailOptions(result.email, '<h1>Congrats your account success register!</h1>'), (err, info) => {
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

const resetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return console.log(err)
    const token = buffer.toString('hex')
    User.findOne({email : req.body.email})
    .then((user) => {
      if(!user) return res.status(424).json({error : "User dont exists with that email"})
      user.resetToken = token
      user.expireToken = Date.now() + 3600000 // waktu sekarang di tambah 3600000 milisecond = 1 jam
      user.save()
      .then((result) => {
        transporter.sendMail({
          from: 'erdevlop@gmail.com',
          to: result.email,
          subject: 'Reset Password',
          html: `
            <p>You request for password reset</p>
            <h4>click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset password</h4>
          `
        });
        res.json({message : "check your email"})
      }).catch((err) => {
        
      });
    }).catch((err) => {
      
    });
  })
}

const newPassword = (req, res) => {
  const newPassword = req.body.password
  const sentToken = req.body.token

  User.findOne({resetToken : sentToken, expireToken :{$gt:Date.now()}}) // maksud dari $gt adalah lebih dari
  .then((user) => {
    if(!user) return res.status(404).json({error : "Try again session expired"})
    bcrypt.hash(newPassword,12)
    .then((hashedPassword) => {
      user.password = hashedPassword
      user.resetToken = undefined
      user.expireToken = undefined
      user.save().then(() => {
        res.json({message: "password updated successfully!"})
      })
    }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
}

module.exports = {
  index,
  signup,
  signin,
  resetPassword,
  newPassword
}