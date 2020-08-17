const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')

// Connected to mongoDB Atlas
mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log('connected to mongo success'))
  .catch(() =>console.log('connected to mongo failed'))

// middleware
app.use(express.urlencoded())
app.use(express.json())
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // cors
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// regis model
require('./models/UserModel')
require('./models/PostModel')

// regis route
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.com`)
  console.log(__dirname)
})
