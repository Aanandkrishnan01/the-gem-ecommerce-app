const admin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: 'Access denied. Authentication required.'
      });
    }

    // Check if user has admin privileges
    if (!req.user.user.isAdmin) {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      message: 'Server error during admin authorization.'
    });
  }
};

module.exports = admin;