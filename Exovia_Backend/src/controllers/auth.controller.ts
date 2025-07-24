import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangeEmail } from '../services/email.service';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by the model pre-save hook)
    const user = new User({
      name,
      email,
      password, // Use plain password - model will hash it
      role: 'user',
      isBlocked: false,
      isFirstLogin: true
    });

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with registration even if email fails
    }

    // Generate token with user role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      isFirstLogin: user.isFirstLogin
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login Debug:');
    console.log('  Email:', email);
    console.log('  Password provided:', password ? 'YES' : 'NO');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('  User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('  User found:', { id: user._id, name: user.name, email: user.email });
    console.log('  Stored password hash:', user.password ? 'EXISTS' : 'MISSING');

    // Check if user is blocked
    if (user.isBlocked) {
      console.log('  User is blocked');
      return res.status(403).json({ message: 'Account is blocked' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('  Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last active timestamp
    try {
      user.lastActive = new Date();
      await user.save();
    } catch (saveError) {
      console.error('Error updating lastActive:', saveError);
      // Continue with login even if lastActive update fails
    }

    // Generate token with user role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      isFirstLogin: user.isFirstLogin
    };

    // If this is the first login, update the flag
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
    }

    console.log('  Login successful for user:', userData.name);
    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last active timestamp
    try {
      user.lastActive = new Date();
      await user.save();
    } catch (saveError) {
      console.error('Error updating lastActive:', saveError);
      // Continue even if lastActive update fails
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error getting user data' });
  }
};

// Heartbeat endpoint to keep user active
export const heartbeat = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last active timestamp
    try {
      user.lastActive = new Date();
      await user.save();
    } catch (saveError) {
      console.error('Error updating lastActive:', saveError);
      // Continue even if lastActive update fails
    }

    res.json({ message: 'Heartbeat received' });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ message: 'Error updating heartbeat' });
  }
};

// Update user profile (name, emailNotifications)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, emailNotifications } = req.body;
    const updateFields: any = {};
    if (typeof name === 'string' && name.trim()) updateFields.name = name.trim();
    if (typeof emailNotifications === 'boolean') updateFields.emailNotifications = emailNotifications;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, select: '-password' }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetLink, user.name);
      res.json({ message: 'Password reset email sent successfully' });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      res.status(500).json({ message: 'Failed to send password reset email' });
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Error processing password reset request' });
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password using findByIdAndUpdate to bypass pre-save hook
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send password change notification email
    try {
      const ipAddress = req.ip || 
                       req.connection.remoteAddress || 
                       (Array.isArray(req.headers['x-forwarded-for']) 
                         ? req.headers['x-forwarded-for'][0] 
                         : req.headers['x-forwarded-for']);
      await sendPasswordChangeEmail(updatedUser.email, updatedUser.name, ipAddress);
    } catch (emailError) {
      console.error('Failed to send password change email:', emailError);
      // Don't fail the password change if email fails
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
}; 