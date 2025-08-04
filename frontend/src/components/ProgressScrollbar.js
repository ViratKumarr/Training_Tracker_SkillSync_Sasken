import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const ProgressScrollbar = ({ enrollment, onProgressUpdate, onDelete }) => {
  const { updateProgress, deleteEnrollment } = useAppData();
  const [currentProgress, setCurrentProgress] = useState(enrollment.completionPercentage || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setCurrentProgress(enrollment.completionPercentage || 0);
  }, [enrollment.completionPercentage]);

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setCurrentProgress(newProgress);
  };

  const handleProgressUpdate = async () => {
    try {
      setIsUpdating(true);
      setMessage(null);

      // Update progress in context (real-time UI update)
      updateProgress(enrollment.user.id, enrollment.course.id, currentProgress);

      // Try to sync with backend API
      try {
        await apiClient.put('/progress/update-progress', {
          userId: enrollment.user.id,
          courseId: enrollment.course.id,
          completionPercentage: currentProgress
        });
      } catch (apiError) {
        console.log('API sync failed, but progress updated locally:', apiError);
      }

      // Calculate time spent
      const timeSpentHours = Math.round(enrollment.course.durationHours * (currentProgress / 100));
      const timeSpentMinutes = timeSpentHours * 60;

      setMessage({
        type: 'success',
        text: `Progress updated to ${currentProgress}%! Time spent: ${timeSpentHours} hours (${timeSpentMinutes} minutes)`
      });

      if (onProgressUpdate) {
        onProgressUpdate(currentProgress);
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      setMessage({
        type: 'danger',
        text: 'Error updating progress: ' + error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkComplete = async () => {
    setCurrentProgress(100);
    await handleProgressUpdate();
  };

  const handleDeleteEnrollment = () => {
    if (window.confirm(`Are you sure you want to delete your enrollment in "${enrollment.course.title}"? This action cannot be undone.`)) {
      deleteEnrollment(enrollment.id);
      if (onDelete) {
        onDelete(enrollment.id);
      }
    }
  };

  const getProgressColor = () => {
    if (currentProgress >= 100) return '#28a745'; // Green
    if (currentProgress >= 75) return '#17a2b8'; // Info blue
    if (currentProgress >= 50) return '#ffc107'; // Warning yellow
    if (currentProgress >= 25) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
  };

  const getStatusBadge = () => {
    if (currentProgress >= 100) return { text: 'Completed', variant: 'success' };
    if (currentProgress > 0) return { text: 'In Progress', variant: 'warning' };
    return { text: 'Not Started', variant: 'secondary' };
  };

  const calculateTimeSpent = () => {
    const totalHours = enrollment.course.durationHours || 0;
    const spentHours = Math.round(totalHours * (currentProgress / 100));
    const spentMinutes = spentHours * 60;
    return { hours: spentHours, minutes: spentMinutes, totalHours };
  };

  const timeData = calculateTimeSpent();
  const statusBadge = getStatusBadge();

  return (
    <div className="progress-scrollbar-container p-3 border rounded mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">{enrollment.course.title}</h6>
        <span className={`badge bg-${statusBadge.variant}`}>
          {statusBadge.text}
        </span>
      </div>
      
      <div className="mb-3">
        <small className="text-muted">
          Duration: {enrollment.course.durationHours} hours | 
          Time Spent: {timeData.hours} hours ({timeData.minutes} minutes) | 
          Remaining: {timeData.totalHours - timeData.hours} hours
        </small>
      </div>

      {message && (
        <Alert variant={message.type} className="py-2 mb-3">
          {message.text}
        </Alert>
      )}

      <div className="mb-3">
        <Form.Label className="d-flex justify-content-between">
          <span>Progress: {currentProgress}%</span>
          <span className="text-muted">
            {timeData.hours}/{timeData.totalHours} hours
          </span>
        </Form.Label>
        
        <Form.Range
          min="0"
          max="100"
          step="1"
          value={currentProgress}
          onChange={handleProgressChange}
          style={{
            background: `linear-gradient(to right, ${getProgressColor()} 0%, ${getProgressColor()} ${currentProgress}%, #e9ecef ${currentProgress}%, #e9ecef 100%)`
          }}
          className="custom-range"
        />
        
        <div className="d-flex justify-content-between text-muted small mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="d-flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleProgressUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Progress'}
        </Button>
        
        <Button
          variant="success"
          size="sm"
          onClick={handleMarkComplete}
          disabled={isUpdating || currentProgress >= 100}
        >
          Mark Complete
        </Button>

        {enrollment.course.materials && (
          <Button
            variant="outline-info"
            size="sm"
            href={enrollment.course.materials}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Course
          </Button>
        )}

        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleDeleteEnrollment}
          disabled={isUpdating}
        >
          <i className="fas fa-trash me-1"></i>
          Delete
        </Button>
      </div>

      <style jsx>{`
        .custom-range::-webkit-slider-thumb {
          background: ${getProgressColor()};
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .custom-range::-moz-range-thumb {
          background: ${getProgressColor()};
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .progress-scrollbar-container {
          background: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .progress-scrollbar-container:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ProgressScrollbar;
