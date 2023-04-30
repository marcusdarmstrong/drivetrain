'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import CassetteSelector from './CassetteSelector'
import ChainringSelector from './ChainringSelector'
import CadenceSelector from './CadenceSelector'
import WheelSelector from './WheelSelector'
import DriveTrainDeleter from './DriveTrainDeleter';

import { serializeDrivetrain, type Drivetrain, type Cassette, type Chainring, type Wheel } from './marshalling';
import { useIndexedSearchParamNavigationCallback } from './navigation';

function useSetCassetteCallback(drivetrain: Drivetrain) {
  const { cassette } = drivetrain;
  return useCallback((callback: (oldCassette: Cassette) => Cassette) => {
    return serializeDrivetrain({
      ...drivetrain, 
      cassette: callback(cassette),
    });
  }, [drivetrain, cassette]);
}

function useSetChainringCallback(drivetrain: Drivetrain) {
  const { chainring } = drivetrain;
  return useCallback((callback: (oldChainring: Chainring) => Chainring) => {
    return serializeDrivetrain({
      ...drivetrain, 
      chainring: callback(chainring),
    });
  }, [drivetrain, chainring]);
}

function useSetWheelCallback(drivetrain: Drivetrain) {
  const { wheel } = drivetrain;
  return useCallback((callback: (oldWheel: Wheel) => Wheel) => {
    return serializeDrivetrain({
      ...drivetrain, 
      wheel: callback(wheel),
    });
  }, [drivetrain, wheel]);
}

export default function DriveTrainEditor({ index, drivetrain }: { index: number, drivetrain: Drivetrain }) {
  const { cassette, chainring, wheel } = drivetrain;

  // @ts-expect-error: This is a TODO
  const setCassette = useIndexedSearchParamNavigationCallback(index, useSetCassetteCallback(drivetrain));
  // @ts-expect-error: This is a TODO
  const setChainring = useIndexedSearchParamNavigationCallback(index, useSetChainringCallback(drivetrain));
  // @ts-expect-error: This is a TODO
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
