// Middleware: Chỉ cho phép role=admin truy cập
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Chỉ admin mới có quyền thực hiện thao tác này.' });
}

module.exports = adminOnly;
