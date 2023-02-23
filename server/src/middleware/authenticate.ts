import jwt from 'jsonwebtoken';
import config from 'config';
import { Request, Response, NextFunction } from 'express';
import { findSessions } from '../service/session.service';


 async function authenticate(req: any, res: Response, next: NextFunction) {

  // Get token from request header
  const token = req.header('x-auth-token');

   // Check that token is provided
  if (!token) {
    return res.status(403).send("Access denied. No token provided");
  }

  try {
     // Verify token
    const decoded: any = jwt.verify(token, config.get('privateKey'));
     // Get sessionId from decoded token
    const sessionId = decoded.session;
    // Find session associated with the token
    const session = await findSessions({ _id: sessionId, valid: true });
    // Exit if session is invalid
    if (!session) {
      return res.status(403).send("Invalid token1.");
    }
    // Assign user data to request object
    req.user = { ...decoded, session };
    // Call next function
    next();
  } catch (ex) {
    res.status(403).send("Invalid token2.");
  }
}

export default authenticate;