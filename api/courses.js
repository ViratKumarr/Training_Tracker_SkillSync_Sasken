const { db, initializeDatabase } = require('./database');

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

    if (req.method === 'GET') {
      // Get all active courses
      db.all(`
        SELECT c.*, u.first_name as trainer_first_name, u.last_name as trainer_last_name
        FROM courses c
        LEFT JOIN users u ON c.trainer_id = u.id
        WHERE c.is_active = 1
        ORDER BY c.created_at DESC
      `, [], (err, courses) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Format courses with trainer information
        const formattedCourses = courses.map(course => ({
          ...course,
          trainer: course.trainer_first_name ? {
            id: course.trainer_id,
            firstName: course.trainer_first_name,
            lastName: course.trainer_last_name
          } : null
        }));

        res.status(200).json(formattedCourses);
      });

    } else if (req.method === 'POST') {
      // Create new course (requires authentication)
      const { title, description, category, type, durationHours, trainerId, isMandatory, maxParticipants, prerequisites, materials } = req.body;

      if (!title || !category || !type) {
        return res.status(400).json({ error: 'Title, category, and type are required' });
      }

      const stmt = db.prepare(`INSERT INTO courses 
        (title, description, category, type, duration_hours, trainer_id, is_mandatory, max_participants, prerequisites, materials) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      stmt.run([
        title,
        description,
        category,
        type,
        durationHours || 0,
        trainerId,
        isMandatory || 0,
        maxParticipants || 50,
        prerequisites,
        materials
      ], function(err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Failed to create course' });
        }

        // Get the created course
        db.get(`
          SELECT c.*, u.first_name as trainer_first_name, u.last_name as trainer_last_name
          FROM courses c
          LEFT JOIN users u ON c.trainer_id = u.id
          WHERE c.id = ?
        `, [this.lastID], (err, course) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          const formattedCourse = {
            ...course,
            trainer: course.trainer_first_name ? {
              id: course.trainer_id,
              firstName: course.trainer_first_name,
              lastName: course.trainer_last_name
            } : null
          };

          res.status(201).json({
            message: 'Course created successfully',
            course: formattedCourse
          });
        });
      });

      stmt.finalize();

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Courses API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
