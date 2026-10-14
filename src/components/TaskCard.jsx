import React from 'react';
import { 
  Clock, 
  Tag, 
  MoreVertical, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TaskCard = ({
  task,
  onUpdateStatus,
  onEditTask,
  onDeleteTask
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handleMoveStatus = (newStatus) => {
    if (newStatus === 'done') {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onUpdateStatus(task.id, newStatus);
  };

  const statusOrder = ['todo', 'in_progress', 'review', 'done'];
  const currentIndex = statusOrder.indexOf(task.status);
  const nextStatus = currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;
  const prevStatus = currentIndex > 0 ? statusOrder[currentIndex - 1] : null;

  const getStatusLabel = (status) => {
    switch(status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'review': return 'In Review';
      case 'done': return 'Done';
      default: return status;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--primary-glow)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-medium)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Top Row: Priority Badge & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className={`badge badge-priority-${task.priority}`}>
          {task.priority.toUpperCase()}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => onEditTask(task)}
            className="btn btn-ghost"
            style={{ padding: '0.25rem', borderRadius: '4px' }}
            title="Edit task"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="btn btn-ghost"
            style={{ padding: '0.25rem', borderRadius: '4px', color: 'var(--text-dim)' }}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 style={{
        fontSize: '0.98rem',
        fontWeight: 700,
        color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-main)',
        textDecoration: task.status === 'done' ? 'line-through' : 'none',
        lineHeight: 1.35
      }}>
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p style={{
          fontSize: '0.84rem',
          color: 'var(--text-dim)',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                background: 'var(--border-subtle)',
                color: 'var(--text-muted)',
                borderRadius: '4px',
                fontWeight: 500
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Due date & Assignee */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.65rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '0.25rem'
      }}>
        {/* Assignee */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {task.assigneeAvatar ? (
            <img
              src={task.assigneeAvatar}
              alt={task.assigneeName}
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 700
            }}>
              {(task.assigneeName || 'U').charAt(0)}
            </div>
          )}
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {task.assigneeName}
          </span>
        </div>

        {/* Due Date Indicator */}
        {task.dueDate && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: isOverdue ? 'var(--priority-urgent)' : 'var(--text-dim)'
          }}>
            {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>

      {/* Quick Move Buttons Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.3rem 0.5rem',
        marginTop: '0.2rem'
      }}>
        {prevStatus ? (
          <button
            onClick={() => handleMoveStatus(prevStatus)}
            className="btn btn-ghost"
            style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem' }}
            title={`Move back to ${getStatusLabel(prevStatus)}`}
          >
            <ArrowLeft size={12} />
            <span>{getStatusLabel(prevStatus)}</span>
          </button>
        ) : <div />}

        {nextStatus && (
          <button
            onClick={() => handleMoveStatus(nextStatus)}
            className="btn btn-primary"
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.72rem',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'none'
            }}
            title={`Promote to ${getStatusLabel(nextStatus)}`}
          >
            <span>{getStatusLabel(nextStatus)}</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
