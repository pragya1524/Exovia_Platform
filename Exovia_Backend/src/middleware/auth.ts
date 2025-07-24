import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);

    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    console.log('Decoded token:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Invalid token structure');
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      console.log('User is blocked');
      return res.status(403).json({ message: 'Account is blocked' });
    }

    // Attach user to request
    req.user = user;
    console.log('User attached to request:', req.user);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}; 