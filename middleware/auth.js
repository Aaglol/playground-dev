const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_TOKEN;

module.exports = { 
    AdminAuth: async (req, res, next) => {
        const token = req.cookie.jwt;
        if (token) {
            jwt.verify(token, jwtSecret, (error, dekodedToken) => {
                if (error) {
                    return res.status(401).send('Du har ikke tilgang');
                }

                next();
            });
        }
    },
    UserAuth: async (req, res, next) => {
        if (Object.hasOwnProperty.call(req.cookies, 'jwt')) {
            const token = req.cookies.jwt;
            
            if (token) {
                jwt.verify(token, jwtSecret, (error, dekodedToken) => {
                    if (!req.app.get('user_id') && dekodedToken) {
                        req.app.set('user_id', dekodedToken.id);
                    }
                    if (error !== null) {
                        return res.status(401).send('Du har ikke tilgang');
                    }

                    next();
                });
            }
        } else {
            return res.status(401).send('Du har ikke tilgang');
        }
    },
}
