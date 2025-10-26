// src/components/TodoItem.tsx
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => void;
  isProcessed?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, isProcessed }) => (
  <div
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''} ${isProcessed ? 'is-disabled' : ''}`}
  >
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={onDelete}
      disabled={isProcessed}
      aria-label="Delete todo"
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isProcessed ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
