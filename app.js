const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');

// Import routes
const indexRouter = require('./routes/index');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect Username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // Passwords match - log user in
          return done(null, user);
        }

        // Password do not match
        return done(null, false, { message: 'Incorrect Password' });
      });
    });
  })
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Add imported routes to middleware stack
app.use('/', indexRouter);

// Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops! Something went wrong...');
});

app.listen(PORT, () => `App listening on Port ${ PORT }`);
