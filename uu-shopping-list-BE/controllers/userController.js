const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; 
//change for database?  
let users = []; // In-memory user storage

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user with hashed password
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully!' });
};


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  // Compare password with the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  res.json({ token });
};