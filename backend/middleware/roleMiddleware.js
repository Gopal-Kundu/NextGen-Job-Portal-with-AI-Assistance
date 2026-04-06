const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(401).json({ msg: "Access denied" });
    }
    next();
  };
};

module.exports = {allowRoles};