'use client';

import { useIndexedSearchParamNavigationCallback } from './navigation';
import { IconButton } from './ui';
import { Trash } from './icons';

const deletionReducer = () => null; 
export default function DriveTrainDeleter({ index }: { index: number }) {
  // @ts-expect-error: TODO
  const callback = useIndexedSearchParamNavigationCallback(index, deletionReducer);
  return <IconButton size={2} onClick={callback} alt="Delete this drivetrain"><Trash /></IconButton>;
}

