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
      // Get notifications
      const userId = req.query.userId || (user ? user.id : null);
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      db.all(`
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY 
          CASE WHEN is_read = 0 THEN 0 ELSE 1 END,
          CASE priority 
            WHEN 'URGENT' THEN 1 
            WHEN 'HIGH' THEN 2 
            WHEN 'MEDIUM' THEN 3 
            WHEN 'LOW' THEN 4 
          END,
          sent_at DESC
        LIMIT 50
      `, [userId], (err, notifications) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(notifications);
      });

    } else if (req.method === 'POST') {
      // Create notification
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { 
        userId, 
        title, 
        message, 
        type = 'SYSTEM_ANNOUNCEMENT', 
        priority = 'MEDIUM',
        relatedEntityType,
        relatedEntityId 
      } = req.body;

      if (!userId || !title || !message) {
        return res.status(400).json({ error: 'User ID, title, and message are required' });
      }

      const stmt = db.prepare(`INSERT INTO notifications 
        (user_id, title, message, type, priority, related_entity_type, related_entity_id, status, sent_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'SENT', CURRENT_TIMESTAMP)`);

      stmt.run([
        userId,
        title,
        message,
        type,
        priority,
        relatedEntityType,
        relatedEntityId
      ], function(err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Failed to create notification' });
        }

        res.status(201).json({
          message: 'Notification created successfully',
          notificationId: this.lastID
        });
      });

      stmt.finalize();

    } else if (req.method === 'PUT') {
      // Mark notification as read
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { notificationId, markAllAsRead } = req.body;

      if (markAllAsRead) {
        // Mark all notifications as read for the user
        db.run(`UPDATE notifications SET 
          is_read = 1, 
          read_at = CURRENT_TIMESTAMP 
          WHERE user_id = ? AND is_read = 0`, 
          [user.id], function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to mark notifications as read' });
          }

          res.status(200).json({ 
            message: 'All notifications marked as read',
            updatedCount: this.changes
          });
        });

      } else if (notificationId) {
        // Mark specific notification as read
        db.run(`UPDATE notifications SET 
          is_read = 1, 
          read_at = CURRENT_TIMESTAMP 
          WHERE id = ? AND user_id = ?`, 
          [notificationId, user.id], function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to mark notification as read' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'Notification not found' });
          }

          res.status(200).json({ message: 'Notification marked as read' });
        });

      } else {
        return res.status(400).json({ error: 'Notification ID or markAllAsRead flag is required' });
      }

    } else if (req.method === 'DELETE') {
      // Delete notification
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const notificationId = req.query.id;

      if (!notificationId) {
        return res.status(400).json({ error: 'Notification ID is required' });
      }

      db.run('DELETE FROM notifications WHERE id = ? AND user_id = ?', 
        [notificationId, user.id], function(err) {
        if (err) {
          console.error('Delete error:', err);
          return res.status(500).json({ error: 'Failed to delete notification' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Notifications API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
