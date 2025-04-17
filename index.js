const express = require('express');
const cron = require('node-cron');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Replace this with your Replit public URL
const CALLBACK_URL = 'https://your-repl-name.username.repl.co/auth/google/callback';

const GOOGLE_CLIENT_ID = '264134101669-dn4aet933uum691ltu5fgg1it70csdf4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

app.use(express.static(path.join(__dirname)));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/guest');
  });

app.get('/guest', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Root route (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});