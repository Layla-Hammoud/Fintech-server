import  jwt  from "jsonwebtoken";


const authenticateToken = (request, response, next) => {
    try {
    // The token will contain =Bearer token
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Token not provided');
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.userData = decoded;
      next();
    } catch (error) {
      return response.status(401).json({
        message: 'Authentication failed',
      });
    }
  };


  const isAdmin = (request, response, next) => {
    if (request.userData && request.userData.role === 'admin') {
      next(); // Allow access for admin users
    } else {
        response.status(403).json({ message: 'Admin access required' });
    }
  };
  
  const isMerchant = (request, response, next) => {
    if (request.userData && request.userData.role === 'merchant') {
      next(); // Allow access for merchant users
    } else {
    response.status(403).json({ message: 'Merchant access required' });
    }
  };
  
  export {authenticateToken, isMerchant, isAdmin};