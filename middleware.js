const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // store their requested url
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not signed in!');
        res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;