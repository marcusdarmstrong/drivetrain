'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import CassetteSelector from './CassetteSelector'
import ChainringSelector from './ChainringSelector'
import CadenceSelector from './CadenceSelector'
import WheelSelector from './WheelSelector'
import DriveTrainDeleter from './DriveTrainDeleter';

import { serializeDrivetrain } from './marshalling';
import { useIndexedSearchParamNavigationCallback } from './navigation';

function useSetCassetteCallback(drivetrain) {
  const { cassette } = drivetrain;
  return useCallback((callback) => {
    console.log("hello")
    return serializeDrivetrain({
      ...drivetrain, 
      cassette: callback(cassette),
    });
  }, [drivetrain, cassette]);
}

function useSetChainringCallback(drivetrain) {
  const { chainring } = drivetrain;
  return useCallback((callback) => {
    return serializeDrivetrain({
      ...drivetrain, 
      chainring: callback(chainring),
    });
  }, [drivetrain, chainring]);
}

function useSetWheelCallback(drivetrain) {
  const { wheel } = drivetrain;
  return useCallback((callback) => {
    return serializeDrivetrain({
      ...drivetrain, 
      wheel: callback(wheel),
    });
  }, [drivetrain, wheel]);
}

export default function DriveTrainEditor({ index, drivetrain }) {
  const { cassette, chainring, wheel } = drivetrain;

  const setCassette = useIndexedSearchParamNavigationCallback(index, useSetCassetteCallback(drivetrain));
  const setChainring = useIndexedSearchParamNavigationCallback(index, useSetChainringCallback(drivetrain));
  const setWheel = useIndexedSearchParamNavigationCallback(index, useSetWheelCallback(drivetrain));

  return (
    <div className="flex">
      <div className="w-2/5">
        <CassetteSelector cassette={cassette} setCassette={setCassette} />
      </div>
      <div className="w-1/5">
        <ChainringSelector chainring={chainring} setChainring={setChainring} />
      </div>
      <div className="w-1/5">
        <WheelSelector wheel={wheel} setWheel={setWheel} />
      </div>
      <div className="w-1/5">
        <DriveTrainDeleter index={index} />
      </div>
    </div>
  );
};
