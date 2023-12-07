import { verifyToken } from "../utils/jwt";


const isAuthenticated = (request, response, next) => {
    try {
      const token = request.cookies.token;
      if (!token) throw new Error('Token not provided');
  
      const decoded = verifyToken(token);
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