'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export const params = {
  drivetrain: 'd',
  cadence: 'c',
};

export function useIndexedSearchParamNavigationCallback(index, callback) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useCallback((...parameters) => {
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

export function useSearchParamNavigationCallback(param, callback) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useCallback((...parameters) => {
    const updated = new URLSearchParams(searchParams);
    updated.set(param, callback(...parameters));
    router.push(`${pathname}?${updated.toString()}`);
  }, [router, pathname, searchParams, param, callback]); 
}