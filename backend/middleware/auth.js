const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.generateToken = async (walletAddress) => {
  try {
    const payload = { walletAddress }; // Include walletAddress in the payload
    const expiresIn = '12h'; // Token expiration time (12 hours)

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error; // Re-throw the error for proper handling
  }
};