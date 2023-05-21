import { createElement, type ReactNode, type MouseEventHandler } from 'react';

import { Gear, Plus, Trash, X } from './icons';

export function IconButton({ size = 2, onClick, children, alt }: { size: number, alt: string, onClick: MouseEventHandler<HTMLButtonElement>, children: ReactNode }) {
  let sizing = 'p-0'
  if (size === 0) {
    sizing = 'p-0';
  } else if (size === 1) {
    sizing = 'p-1';
  } else if (size === 2) {
    sizing = 'p-2';
  } else if (size === 3) {
    sizing = 'p-3';
  }
  return (
    <button
      type="button"
      className={`inline-block rounded-md border border-indigo-600 ${sizing} text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500`}
      onClick={onClick}
    >
      <span className="sr-only">{alt}</span>
      {children}
    </button>
  );
};

export function Button({ variant = 'base', onClick, children }: { variant: 'base' | 'pill', onClick: MouseEventHandler<HTMLButtonElement>, children: ReactNode }) {
  const rounding = variant === 'base' ? `rounded` : `rounded-full`;

  return (
    <button
      type="button"
      className={`inline-block ${rounding} border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500`}
      onClick={onClick}>
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 shadow-xl"
    >
      <div className="rounded-xl bg-white p-2 sm:p-3 lg:p-4 gap-2 flex flex-wrap">
        {children}
      </div>
    </div>
  );
}

export function Banner({ children }: { children: ReactNode }) {
  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-lime-500 shadow-xl p-3 gap-2 flex flex-wrap`}
    >
      {children}
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full justify-between gap-2 flex-wrap lg:flex-nowrap">
      {children}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-1">{children}</div>
  );
}

export function Box({ children }: { children: ReactNode }) {
  return (
    <div
      className="grow lg:grow-0 flex flex-wrap rounded border-2 border-gray-100 bg-white p-2 sm:p-3 lg:p-4 gap-1"
    >
      {children}
    </div>
  );
}

export function Copy({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm text-gray-500">{children}</p>;
}

const headerSizing = {
  h1: 'text-2xl',
  h2: 'text-xl',
  h3: 'text-lg sm:text-xl',
  h4: 'text-md sm:text-lg',
} as const;
export function Header(
  { level, children }:
  { level: 'h1' | 'h2' | 'h3' | 'h4', children: ReactNode }
) {
  return createElement(
    level,
    {
      className: `${headerSizing[level]} justify-between font-bold text-gray-900 flex w-full`,
    },
    children
  );
}

export function Spacer({ children }: { children: ReactNode }) {
  return <div className="sm:p-1 lg:p-2 w-full">{children}</div>;
}

export function ActionBadge({ children, onClick, action }: {children: ReactNode, onClick: () => unknown, action: ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700"
    >
      <p className="whitespace-nowrap text-sm">{children}</p>

      <button
        className="-me-1 ms-1.5 inline-block rounded-full bg-indigo-200 p-0.5 text-indigo-700 transition hover:bg-indigo-300"
        onClick={onClick}
      >
        {action}
      </button>
    </span>
  );
}

export function BadgeButton({ children, onClick }: {children: ReactNode, onClick: () => unknown }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700"
      onClick={onClick}
    >
      <p className="whitespace-nowrap text-sm">{children}</p>
    </button>
  );
}
