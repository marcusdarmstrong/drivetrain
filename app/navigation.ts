'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export const params = {
  drivetrain: 'd',
  cadence: 'c',
};

export function useIndexedSearchParamNavigationCallback(index: number, callback: (...params: unknown[]) => string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useCallback((...parameters: unknown[]) => {
    const updated = new URLSearchParams();
    let encounteredIndex = 0;
    searchParams.forEach((value, key) => {
      if (key === params.drivetrain && encounteredIndex++ === index) {
        const computed = callback(...parameters);
        if (computed !== null) {
          updated.append(key, computed);
        }
      } else {
        updated.append(key, value);
      }
    });
    if (encounteredIndex <= index) {
      const computed = callback(...parameters);
      if (computed !== null) {
        updated.append(params.drivetrain, computed);
      }
    }
    router.push(`${pathname}?${updated.toString()}`);
  }, [router, pathname, searchParams, index, callback]);
}

export function useSearchParamNavigationCallback(param: string, callback: (...params: unknown[]) => string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useCallback((...parameters: unknown[]) => {
    const updated = new URLSearchParams(searchParams as any as URLSearchParams);
    updated.set(param, callback(...parameters));
    router.push(`${pathname}?${updated.toString()}`);
  }, [router, pathname, searchParams, param, callback]); 
}