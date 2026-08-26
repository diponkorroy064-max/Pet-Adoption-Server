const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { payload } = await jwtVerify(token, JWKS);
        // Attach decoded user data to req object
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden access' });
    }
};

module.exports = { verifyToken };

