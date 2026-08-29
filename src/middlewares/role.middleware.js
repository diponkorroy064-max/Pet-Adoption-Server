const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Assuming 'role' claim exists in your JWKS JWT payload---
        const userRole = req.user?.role || 'user';

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Access denied: Insufficient privileges'
            });
        }
        next();
    };
};

module.exports = { verifyRole };
