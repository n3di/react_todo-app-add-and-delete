import React, { useContext, useMemo } from 'react';
import { TodosContext } from 'features/todos/contexts/TodoContext';
import { TodoItem } from 'features/todos/ui/TodoItem';
import { EditProvider } from 'features/todos/contexts/EditContext';
import { FILTER } from 'features/todos/model/types';

export const TodoList: React.FC = () => {
  const { state, deletingTodoIds } = useContext(TodosContext);
  const { todos, filter, tempTodo } = state;

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FILTER.COMPLETED:
        return todos.filter(t => t.completed);
      case FILTER.ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 && (
        <EditProvider>
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={deletingTodoIds.includes(todo.id)}
            />
          ))}
        </EditProvider>
      )}

      {tempTodo && (
        <TodoItem key={`temp-${tempTodo.title}`} todo={tempTodo} isLoading />
      )}
    </section>
  );
};
