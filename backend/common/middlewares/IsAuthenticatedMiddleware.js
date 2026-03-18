const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config");
const tokenBlocklist = require("../tokenBlocklist");

module.exports = {
  check: (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // IF no auth headers are provided
    // THEN return 401 Unauthorized error
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Auth headers not provided in the request.'
        }
      });
    }

    // IF bearer auth header is not provided
    // THEN return 401 Unauthorized error
    if (!authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Invalid auth mechanism.'
        }
      });
    }

    const token = authHeader.split(' ')[1];

    // IF bearer auth header is provided, but token is not provided
    // THEN return 401 Unauthorized error
    if (!token) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Bearer token missing in the authorization headers.'
        }
      })
    }

    // IF the token has been invalidated via logout
    // THEN return 401 Unauthorized error
    if (tokenBlocklist.has(token)) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Token has been invalidated. Please login again.'
        }
      });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: false,
          error: 'Invalid access token provided, please login again.'
        });
      }

      req.user = user; // Save the user object for further use
      next();
    });
  }
}
