import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorTypes';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setIsError(ErrorType.LOAD_TODOS);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (isError) {
      timerRef.current = setTimeout(() => {
        setIsError(null);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isError]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleSetFilter = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
  }, []);

  const handleSetIsError = useCallback((error: string | null) => {
    setIsError(error);
  }, []);

  const handleAdd = useCallback(async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      setIsError(ErrorType.EMPTY_TITLE);

      return;
    }

    try {
      setIsAdding(true);

      const temp: Todo = {
        id: 0,
        title: trimmed,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temp);

      const created = await createTodo(trimmed);

      setTodos(prev => [...prev, created]);

      setTempTodo(null);
      setTitle('');
    } catch {
      setTempTodo(null);
      setIsError(ErrorType.ADD_TODO);
    } finally {
      setIsAdding(false);
    }
  }, [title]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await deleteTodo(id);

      setTodos(prev => prev.filter(t => t.id !== id));

      requestAnimationFrame(() => {
        (
          document.getElementById('newTodoField') as HTMLInputElement | null
        )?.focus();
      });
    } catch {
      setIsError(ErrorType.DELETE_TODO);
    } finally {
      setProcessingIds(prev => prev.filter(x => x !== id));
    }
  }, []);

  const handleClearCompleted = useCallback(async () => {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    setProcessingIds(prev => [
      ...prev,
      ...completed.map(t => t.id).filter(id => !prev.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    const succeededIds: number[] = [];
    let hadError = false;

    results.forEach((res, idx) => {
      const id = completed[idx].id;

      if (res.status === 'fulfilled') {
        succeededIds.push(id);
      } else {
        hadError = true;
      }
    });

    if (succeededIds.length) {
      setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));
    }

    setProcessingIds(prev =>
      prev.filter(id => !completed.some(t => t.id === id)),
    );

    if (hadError) {
      setIsError(ErrorType.DELETE_TODO);
    } else {
      requestAnimationFrame(() => {
        (
          document.getElementById('newTodoField') as HTMLInputElement | null
        )?.focus();
      });
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className={`todoapp ${isError ? 'has-error' : ''}`}>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={setTitle}
          onAdd={handleAdd}
          disabled={isAdding}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          onDelete={handleDelete}
        />
        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={handleSetFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification isError={isError} onSetError={handleSetIsError} />
    </div>
  );
};
