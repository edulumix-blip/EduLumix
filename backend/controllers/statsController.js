import Job from '../models/Job.js';
import Resource from '../models/Resource.js';
import Blog from '../models/Blog.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get live platform statistics for homepage
// @route   GET /api/stats/platform
// @access  Public
export const getPlatformStats = async (req, res) => {
  try {
    // Count all collections in parallel
    const [
      totalUsers,
      approvedUsers,
      totalJobs,
      totalResources,
      totalCourses,
      totalBlogs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'approved', role: { $ne: 'super_admin' } }),
      Job.countDocuments({ isDeleted: { $ne: true } }),
      Resource.countDocuments({ isDeleted: { $ne: true } }),
      Course.countDocuments({ isDeleted: { $ne: true } }),
      Blog.countDocuments({ isDeleted: { $ne: true } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        happyUsers: totalUsers,
        contributors: approvedUsers,
        jobsPosted: totalJobs,
        techResources: totalResources,
        courses: totalCourses,
        techBlogs: totalBlogs,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
