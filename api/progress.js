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
      // Get progress records
      const userId = req.query.userId || (user ? user.id : null);
      
      let query = `
        SELECT p.*, c.title as course_title, c.description as course_description,
               c.duration_hours, c.category, u.first_name, u.last_name
        FROM progress p
        JOIN courses c ON p.course_id = c.id
        JOIN users u ON p.user_id = u.id
      `;
      
      let params = [];
      if (userId) {
        query += ' WHERE p.user_id = ?';
        params.push(userId);
      }
      
      query += ' ORDER BY p.last_accessed_at DESC';

      db.all(query, params, (err, progressRecords) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(progressRecords);
      });

    } else if (req.method === 'POST') {
      // Create or update progress
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { courseId, completionPercentage, timeSpentMinutes, status } = req.body;

      if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
      }

      // Check if progress record exists
      db.get('SELECT id FROM progress WHERE user_id = ? AND course_id = ?', [user.id, courseId], (err, existing) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (existing) {
          // Update existing progress
          const updateFields = ['last_accessed_at = CURRENT_TIMESTAMP'];
          const updateValues = [];

          if (completionPercentage !== undefined) {
            updateFields.push('completion_percentage = ?');
            updateValues.push(completionPercentage);
          }
          if (timeSpentMinutes !== undefined) {
            updateFields.push('time_spent_minutes = time_spent_minutes + ?');
            updateValues.push(timeSpentMinutes);
          }
          if (status) {
            updateFields.push('status = ?');
            updateValues.push(status);
          }

          if (status === 'COMPLETED') {
            updateFields.push('completed_at = CURRENT_TIMESTAMP');
          } else if (status === 'IN_PROGRESS' && !existing.started_at) {
            updateFields.push('started_at = CURRENT_TIMESTAMP');
          }

          updateValues.push(existing.id);

          const query = `UPDATE progress SET ${updateFields.join(', ')} WHERE id = ?`;

          db.run(query, updateValues, function(err) {
            if (err) {
              console.error('Update error:', err);
              return res.status(500).json({ error: 'Failed to update progress' });
            }

            res.status(200).json({ message: 'Progress updated successfully' });
          });

        } else {
          // Create new progress record
          const stmt = db.prepare(`INSERT INTO progress 
            (user_id, course_id, completion_percentage, time_spent_minutes, status, started_at, last_accessed_at) 
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);

          stmt.run([
            user.id,
            courseId,
            completionPercentage || 0,
            timeSpentMinutes || 0,
            status || 'IN_PROGRESS'
          ], function(err) {
            if (err) {
              console.error('Insert error:', err);
              return res.status(500).json({ error: 'Failed to create progress' });
            }

            res.status(201).json({
              message: 'Progress created successfully',
              progressId: this.lastID
            });
          });

          stmt.finalize();
        }
      });

    } else if (req.method === 'PUT') {
      // Mark course as completed
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
      }

      // Update progress to completed
      db.run(`UPDATE progress SET 
        status = 'COMPLETED', 
        completion_percentage = 100, 
        completed_at = CURRENT_TIMESTAMP,
        last_accessed_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND course_id = ?`, 
        [user.id, courseId], function(err) {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ error: 'Failed to mark as completed' });
        }

        // Also update enrollment
        db.run(`UPDATE enrollments SET 
          status = 'COMPLETED', 
          completion_percentage = 100, 
          completed_at = CURRENT_TIMESTAMP,
          certificate_earned = 1
          WHERE user_id = ? AND course_id = ?`, 
          [user.id, courseId], function(enrollErr) {
          if (enrollErr) {
            console.error('Enrollment update error:', enrollErr);
          }
        });

        res.status(200).json({ message: 'Course marked as completed' });
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Progress API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
