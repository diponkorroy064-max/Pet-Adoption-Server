let JWKS = null;

const getJWKS = async () => {
    if (!JWKS) {
        if (!process.env.CLIENT_URL) {
            throw new Error('CLIENT_URL environment variable is missing.');
        }
        // Dynamic import of jose ESM module
        const { createRemoteJWKSet } = await import('jose');
        JWKS = createRemoteJWKSet(
            new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
        );
    }
    return JWKS;
};

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const jwks = await getJWKS();
        const { jwtVerify } = await import('jose');

        const { payload } = await jwtVerify(token, jwks);

        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden access', error: error.message });
    }
};

module.exports = { verifyToken };
