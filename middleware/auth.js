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
        const token = req.cookies?.jwt;
        if (token) {
            jwt.verify(token, jwtSecret, (error, dekodedToken) => {
                if (error) {
                    return res.status(401).send('Du har ikke tilgang');
                }

                next();
            });
        } else {
            return res.status(401).send('Du har ikke tilgang');
        }
    },
}