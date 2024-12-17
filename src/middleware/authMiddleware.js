const jwt = require('jsonwebtoken');
const JWT_SECRET = 'thuan123';

exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.authToken;
    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Giải mã token
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {

        next();
    } else {
        res.status(403).send('Bạn không có quyền truy cập.');
    }
    console.log(req.user)
};

exports.checkLoginStatus = (req, res, next) => {
    res.locals.isLoggedIn = !!req.cookies.authToken;
    next();
};

