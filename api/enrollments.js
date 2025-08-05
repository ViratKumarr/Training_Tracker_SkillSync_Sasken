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

    // Authentication for most operations
    let user = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      user = verifyToken(token);
    }

    if (req.method === 'GET') {
      // Get enrollments (with optional user filtering)
      const userId = req.query.userId || (user ? user.id : null);
      
      let query = `
        SELECT e.*, c.title as course_title, c.description as course_description,
               c.duration_hours, c.category, u.first_name, u.last_name, u.email
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN users u ON e.user_id = u.id
      `;
      
      let params = [];
      if (userId) {
        query += ' WHERE e.user_id = ?';
        params.push(userId);
      }
      
      query += ' ORDER BY e.enrolled_at DESC';

      db.all(query, params, (err, enrollments) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(enrollments);
      });

    } else if (req.method === 'POST') {
      // Create new enrollment
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { courseId, type = 'SELF_ENROLLED' } = req.body;

      if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
      }

      // Check if already enrolled
      db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [user.id, courseId], (err, existing) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (existing) {
          return res.status(409).json({ error: 'Already enrolled in this course' });
        }

        // Create enrollment
        const stmt = db.prepare(`INSERT INTO enrollments 
          (user_id, course_id, type, status) 
          VALUES (?, ?, ?, 'ENROLLED')`);

        stmt.run([user.id, courseId, type], function(err) {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ error: 'Failed to create enrollment' });
          }

          // Also create progress record
          const progressStmt = db.prepare(`INSERT INTO progress 
            (user_id, course_id, status) 
            VALUES (?, ?, 'NOT_STARTED')`);

          progressStmt.run([user.id, courseId], function(progressErr) {
            if (progressErr) {
              console.error('Progress insert error:', progressErr);
            }
          });

          progressStmt.finalize();

          res.status(201).json({
            message: 'Enrollment created successfully',
            enrollmentId: this.lastID
          });
        });

        stmt.finalize();
      });

    } else if (req.method === 'PUT') {
      // Update enrollment
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { enrollmentId, status, completionPercentage, grade, notes } = req.body;

      if (!enrollmentId) {
        return res.status(400).json({ error: 'Enrollment ID is required' });
      }

      const updateFields = [];
      const updateValues = [];

      if (status) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }
      if (completionPercentage !== undefined) {
        updateFields.push('completion_percentage = ?');
        updateValues.push(completionPercentage);
      }
      if (grade) {
        updateFields.push('grade = ?');
        updateValues.push(grade);
      }
      if (notes) {
        updateFields.push('notes = ?');
        updateValues.push(notes);
      }

      if (status === 'COMPLETED') {
        updateFields.push('completed_at = CURRENT_TIMESTAMP');
        updateFields.push('certificate_earned = 1');
      }

      updateValues.push(enrollmentId);

      const query = `UPDATE enrollments SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(query, updateValues, function(err) {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ error: 'Failed to update enrollment' });
        }

        res.status(200).json({ message: 'Enrollment updated successfully' });
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Enrollments API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
