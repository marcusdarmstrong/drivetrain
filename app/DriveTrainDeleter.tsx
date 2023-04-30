'use client';

import { useSearchParamNavigationCallback } from './navigation';
import { Button } from './ui';

const deletionReducer = () => null; 
export default function DriveTrainDeleter({ index }) {
  const callback = useSearchParamNavigationCallback(index, deletionReducer);
  return <Button onClick={callback}>Remove this drivetrain</Button>;
}

