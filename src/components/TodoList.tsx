// src/components/TodoList.tsx
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            isProcessed={processingIds.includes(todo.id)}
            onDelete={() => onDelete(todo.id)}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} isProcessed />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
