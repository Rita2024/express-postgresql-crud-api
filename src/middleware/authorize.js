module.exports = function(requiredRole) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized: user or role missing' });
    }
    if (requiredRole && req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Access denied: ${requiredRole} role required` });
    }
    next();
  };
};