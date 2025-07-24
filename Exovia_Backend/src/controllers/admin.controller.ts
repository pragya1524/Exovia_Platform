import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Analysis } from '../models/analysis.model';
import { File } from '../models/file.model';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    
    // Get analysis types distribution
    const analysisTypes = await Analysis.aggregate([
      {
        $group: {
          _id: '$analysisType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get file types distribution
    const fileTypes = await File.aggregate([
      {
        $group: {
          _id: '$fileType',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentFiles = await File.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    const recentAnalyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      stats: {
        totalUsers,
        totalFiles,
        totalAnalyses,
        analysisTypes,
        fileTypes
      },
      recentFiles,
      recentAnalyses
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Map MongoDB _id to id for frontend compatibility
    const mappedUsers = users.map(user => {
      const now = new Date();
      const lastActive = user.lastActive ? new Date(user.lastActive) : new Date();
      const timeDiff = now.getTime() - lastActive.getTime();
      const isCurrentlyActive = timeDiff < 5 * 60 * 1000; // 5 minutes threshold
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        lastActive: user.lastActive || new Date(),
        isCurrentlyActive,
        createdAt: user.createdAt,
        registrationDate: user.createdAt // Use registration date instead of last login
      };
    });

    res.json({ users: mappedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's analyses
    await Analysis.deleteMany({ user: user._id });
    
    // Delete user
    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Block/Unblock user
export const toggleUserBlock = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
}; 