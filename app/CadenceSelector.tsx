'use client';

import { useState, useCallback } from 'react';

import { useSearchParamNavigationCallback, params } from './navigation';
import { serializeCadence, type Cadence } from './marshalling';
import { Button } from './ui';

type CadenceSetter = (oldCadence: Cadence) => Cadence;

function CadenceEditor({ initialMin, initialMax, setCadence }: { initialMin: number, initialMax: number, setCadence: (setter: CadenceSetter) => unknown }) {
  const [max, setMax] = useState(initialMax);
  const [min, setMin] = useState(initialMin);

  return (
    <>
      {min}
      <input type="range" min="50" max={max} value={min} onChange={evt => setMin(parseInt(evt.target.value, 10))} />
      {max}
      <input type="range" min={min} max="150" value={max} onChange={evt => setMax(parseInt(evt.target.value, 10))} />
      <Button onClick={() => setCadence((_: Cadence) => ({ min, max }))}>Save</Button>
    </>
  );
}

export default function CadenceSelector({ cadence }: { cadence: Cadence }) {
  const [editing, setEditing] = useState(false);

  // @ts-expect-error: TODO
  const setCadence = useSearchParamNavigationCallback(params.cadence, useCallback((newCadence: CadenceSetter) => {
    return serializeCadence(newCadence(cadence));
  }, [cadence]));

  return (
    <div className="w-1/3">
      <div className="flex">
        <h3 className="text-xl leading-10">Cadence</h3>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>
      {editing
        ? <CadenceEditor initialMax={cadence.max} initialMin={cadence.min} setCadence={
          (newCadence) => {
            setEditing(false);
            setCadence(newCadence);
          }}/>
        : (
          <div className="flex justify-between">
            <span>Min: {cadence.min}</span>
            <span>Max: {cadence.max}</span>
          </div>
        )
      }
    </div>
  );
};
