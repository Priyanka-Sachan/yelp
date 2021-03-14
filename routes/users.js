const express = require('express');
const router = express.Router({ mergeParams: true });

const passport = require('passport');

const users = require('../controllers/users');

router.route('/register')
    .get(users.signUpForm)
    .post(users.signUp);

router.route('/login')
    .get(users.signInForm)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: true
    }), users.signIn);

router.get('/logout', users.signOut);

module.exports = router;