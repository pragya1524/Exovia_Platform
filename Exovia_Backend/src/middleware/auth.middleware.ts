import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account has been blocked' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔍 AdminAuth - Token received:', token ? 'Yes' : 'No');

    if (!token) {
      console.log('❌ AdminAuth - No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log('🔍 AdminAuth - Decoded token:', { id: decoded.id, role: decoded.role });
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('🔍 AdminAuth - User found:', user ? { id: user._id, email: user.email, role: user.role } : 'No user');

    if (!user) {
      console.log('❌ AdminAuth - User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      console.log('❌ AdminAuth - User is blocked');
      return res.status(403).json({ message: 'Account has been blocked' });
    }

    if (user.role !== 'admin') {
      console.log('❌ AdminAuth - User role is not admin:', user.role);
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    console.log('✅ AdminAuth - Access granted for admin user:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.log('❌ AdminAuth - Error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 