import jwt from 'jsonwebtoken';
import config from 'config';
import { Request, Response, NextFunction } from 'express';
//import { findSessions } from '../service/session.service';
import { reIssueAccessToken } from '../service/session.service';


 async function authenticate(req: any, res: Response, next: NextFunction) {

  // Get token from request header
  const token = req.header('x-auth-token');

   // Check that token is provided
  if (!token) {
    return res.status(403).send("Access denied. No token provided");
  }

  try {
     // Verify token
    const decoded: any = jwt.verify(token, config.get('accessTokenTtl'));
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

///////////////////////////////////////////////////////////

import { auth } from 'express-openid-connect';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;

  // Check if user session exists
  const sessions = await findSessions({ user });
  if (sessions.length === 0) {
    return res.status(403).json({
      error: 'Not authorized'
    });
  }

  // Check if the last session is valid and has the same userAgent as the current request
  const lastSession = sessions[sessions.length - 1];
  if (!lastSession.valid || lastSession.userAgent !== req.headers['user-agent']) {
    return res.status(403).json({
      error: 'Not authorized'
    });
  }

  next();
};






 const authenticate = async (req: any, res: Response, next: NextFunction) => {
  const accessToken = req.header('x-auth-token');

  // Check if access token exists
  if (!accessToken) {
    return res.status(401).json({
      error: 'Unauthorized - no token provided'
    });
  }

  // Verify access token
  const refreshToken = req.session.refreshToken;
  const isValid = await reIssueAccessToken({ refreshToken });
  if (!isValid) {
    return res.status(401).json({
      error: 'Unauthorized - invalid token'
    });
  }

  next();
};

export default authenticate;

