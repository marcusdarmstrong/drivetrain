'use client';

import { useSearchParamNavigationCallback } from './navigation';
import { Button } from './ui';

const deletionReducer = () => null; 
export default function DriveTrainDeleter({ index }: { index: number }) {
  // @ts-expect-error: TODO
  const callback = useSearchParamNavigationCallback(index, deletionReducer);
  return <Button onClick={callback}>Remove this drivetrain</Button>;
}

