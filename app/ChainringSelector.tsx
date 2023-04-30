'use client'

import { useState, useCallback } from 'react';
import { Button } from './ui';
import type { Chainring } from './marshalling';

function RingCreator({ addRing }: { addRing: (ring: string) => unknown}) {
  const [ring, setRing] = useState('20');
  return (
    <>
      <input className="bg-slate-400" type="number" min={20} max={60} onChange={(evt) => setRing(evt.target.value)} value={ring}/>
      <Button onClick={() => addRing(ring)}>Add ring</Button>
    </>
  );
}

function ChainringEditor({ initialChainring, saveChainring }: { initialChainring: Chainring, saveChainring: (newChainring: Chainring) => unknown }) {
  const [adding, setAdding] = useState(false);
  const [chainring, setChainring] = useState(initialChainring);

  const addRing = useCallback((newRing: string) => {
    setChainring(
      (chainrings: Chainring) => 
        [...new Set(
          [...chainrings, parseInt(newRing, 10)]
        )].sort((a, b) => a - b)
    );
    setAdding(false);
  }, []);

  const removeCog = useCallback((toRemove: number) => {
    setChainring(
      (chainrings: Chainring) => chainrings.filter((ring: number) => ring !== toRemove)
    );
  }, []);

  return (
    <>
      <ol>
        {chainring.map((ring: number) => (
          <li className="inline-block p-1" key={ring}>
            <Button onClick={() => removeCog(ring)}>{ring}</Button>
          </li>
        ))}
      </ol>
      {adding
        ? <RingCreator addRing={addRing} />
        : <Button onClick={() => setAdding(true)}>Add a Chainring</Button>}
      <Button onClick={() => saveChainring(chainring)}>Save</Button>
    </>
  );
}

type ChainringSetter = (oldChainring: Chainring) => Chainring;

export default function ChainringSelector({ chainring, setChainring }: { chainring: Chainring, setChainring: (setter: ChainringSetter) => unknown }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="flex">
        <h3 className="text-xl leading-10">Chainring: <span className="text-sm">({chainring.length === 1 ? '1-by' : '2-by'})</span></h3>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>
      {editing 
        ? <ChainringEditor initialChainring={chainring} saveChainring={(newChainring: Chainring) => {
          setEditing(false);
          setChainring(_ => newChainring);
        }} />
        : <ol>
          {chainring.map(ring => (
            <li className="inline-block p-1" key={ring}>
              {ring}
            </li>
          ))}
        </ol>
      }
    </div>
  )
};