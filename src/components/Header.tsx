import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  onAdd: () => void;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onAdd,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled
      />
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          id="newTodoField"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
