const jwt = require('jsonwebtoken');
const auth = async function(req, res, next) {
    const header = req.headers['authorization'];
   
  //const token = req.cookies.token;
  
  const bearer = header.split(' ');
const token = bearer[1];
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
          req.body.id = decoded.id;
          req.body.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = auth;