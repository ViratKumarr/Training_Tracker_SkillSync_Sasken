const { db, initializeDatabase } = require('../database');
const { generateToken, hashPassword } = require('../auth');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize database
    await initializeDatabase();

    const { firstName, lastName, email, employeeId, password, role, department, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !employeeId || !password) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ? OR employee_id = ?', [email, employeeId], (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (existingUser) {
        return res.status(409).json({ error: 'User with this email or employee ID already exists' });
      }

      // Hash password
      const hashedPassword = hashPassword(password);

      // Insert new user
      const stmt = db.prepare(`INSERT INTO users 
        (first_name, last_name, email, employee_id, password, role, department, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

      stmt.run([
        firstName,
        lastName,
        email,
        employeeId,
        hashedPassword,
        role || 'EMPLOYEE',
        department,
        phoneNumber
      ], function(err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // Get the created user
        db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, user) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Generate token
          const token = generateToken(user);

          // Return user data (without password)
          const { password: _, ...userWithoutPassword } = user;

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: userWithoutPassword
          });
        });
      });

      stmt.finalize();
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
