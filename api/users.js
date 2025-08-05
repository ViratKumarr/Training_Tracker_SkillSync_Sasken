const { db, initializeDatabase } = require('./database');
const { verifyToken } = require('./auth');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize database
    await initializeDatabase();

    // Authentication
    let user = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      user = verifyToken(token);
    }

    if (req.method === 'GET') {
      // Get users (admin/manager only for full list)
      if (user && ['ADMIN', 'MANAGER'].includes(user.role)) {
        db.all(`
          SELECT id, first_name, last_name, email, employee_id, role, 
                 department, phone_number, is_active, created_at
          FROM users 
          ORDER BY created_at DESC
        `, [], (err, users) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          res.status(200).json(users);
        });
      } else {
        // Return limited user info for non-admin users
        res.status(403).json({ error: 'Insufficient permissions' });
      }

    } else if (req.method === 'PUT') {
      // Update user
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { userId, firstName, lastName, department, phoneNumber, isActive } = req.body;
      const targetUserId = userId || user.id;

      // Check permissions
      if (targetUserId !== user.id && !['ADMIN', 'MANAGER'].includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const updateFields = [];
      const updateValues = [];

      if (firstName) {
        updateFields.push('first_name = ?');
        updateValues.push(firstName);
      }
      if (lastName) {
        updateFields.push('last_name = ?');
        updateValues.push(lastName);
      }
      if (department) {
        updateFields.push('department = ?');
        updateValues.push(department);
      }
      if (phoneNumber) {
        updateFields.push('phone_number = ?');
        updateValues.push(phoneNumber);
      }
      if (isActive !== undefined && user.role === 'ADMIN') {
        updateFields.push('is_active = ?');
        updateValues.push(isActive ? 1 : 0);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(targetUserId);

      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(query, updateValues, function(err) {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ error: 'Failed to update user' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
