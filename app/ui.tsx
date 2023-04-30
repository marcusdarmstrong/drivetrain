import type { ReactNode, MouseEventHandler } from 'react';

export function Button({ onClick, children }: { onClick: MouseEventHandler<HTMLButtonElement>, children: ReactNode }) {
  return (
    <button
      type="button"
      className="bg-emerald-600 p-1 px-3 m-1 mx-3 rounded-md"
      onClick={onClick}>
        {children}
    </button>
  );
}
