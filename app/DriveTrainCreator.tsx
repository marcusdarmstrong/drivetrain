'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui';

export default function DriveTrainCreator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <Button onClick={() => {
    const updated = new URLSearchParams(searchParams as unknown as URLSearchParams);
    if (updated.getAll('d').length === 0) {
      updated.append('d', '__');
    }
    updated.append('d', '__');
    router.push(`${pathname}?${updated.toString()}`);
  }}>Add a drivetrain</Button>;
}

