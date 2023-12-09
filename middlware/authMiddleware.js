import  jwt  from "jsonwebtoken";


const isAuthenticated = (request, response, next) => {
    try {
      const token = request.headers.authorization.split(' ')[1];
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

 const isAuthorizedUser = (roles) => {
    return (request, response, next) => {
      const userRole = request.userData.role;

      if (!roles.includes(userRole)) {
        return response.status(403).json({ error: 'Forbidden' });
      }

      next();
    };
  };
  
  export {isAuthenticated, isAuthorizedUser};