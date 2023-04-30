'use client'

import { useState, useCallback } from 'react';
import { Button } from './ui';

function RingCreator({ addRing }) {
  const [ring, setRing] = useState('20');
  return (
    <>
      <input className="bg-slate-400" type="number" min={20} max={60} onChange={(evt) => setRing(evt.target.value)} value={ring}/>
      <Button type="button" onClick={() => addRing(ring)}>Add ring</Button>
    </>
  );
}

function ChainringEditor({ initialChainring, saveChainring }) {
  const [adding, setAdding] = useState(false);
  const [chainring, setChainring] = useState(initialChainring);

  const addRing = useCallback((newRing) => {
    setChainring(
      (chainrings) => 
        [...new Set(
          [...chainrings, parseInt(newRing, 10)]
        )].sort((a, b) => a - b)
    );
    setAdding(false);
  }, []);

  const removeCog = useCallback((toRemove) => {
    setChainring(
      (chainrings) => chainrings.filter(ring => ring !== toRemove)
    );
  }, []);

  return (
    <>
      <ol>
        {chainring.map(ring => (
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

export default function ChainringSelector({ chainring, setChainring }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="flex">
        <h3 className="text-xl leading-10">Chainring: <span className="text-sm">({chainring.length === 1 ? '1-by' : '2-by'})</span></h3>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>
      {editing 
        ? <ChainringEditor initialChainring={chainring} saveChainring={(newChainring) => {
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