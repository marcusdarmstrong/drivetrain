'use client'

import { useState, useCallback } from 'react';
import { Button, IconButton, BadgeButton, ActionBadge, Header, Toolbar, Box } from './ui';
import { Gear, Check, Plus, X } from './icons';
import type { Chainring } from './marshalling';

function RingCreator({ addRing }: { addRing: (ring: string) => unknown}) {
  const [ring, setRing] = useState('20');

  return (
    <ActionBadge onClick={() => addRing(ring)} action={<Plus />}>
      <input className="w-20 focus:outline-none focus:ring px-4 rounded-full bg-indigo-50" type="number" min={9} max={60} onChange={(evt) => setRing(evt.target.value)} value={ring}/>
    </ActionBadge>
  );
}

type ChainringSetter = (oldChainring: Chainring) => Chainring;

export default function ChainringSelector({ chainring: initialChainring, setChainring: setInitialChainring }: { chainring: Chainring, setChainring: (setter: ChainringSetter) => unknown }) {
  const [editing, setEditing] = useState(false);
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

  const removeRing = useCallback((toRemove: number) => {
    setChainring(
      (chainrings: Chainring) => chainrings.filter((ring: number) => ring !== toRemove)
    );
  }, []);
  return (
    <Box>
      <Header level="h3">
        <span>Chainring <span className="text-sm">({chainring.length === 1 ? '1-by' : '2-by'})</span></span>
        <Toolbar>
          {editing 
            ? <IconButton alt="Save" size={1} onClick={() => {
              setEditing(false);
              setInitialChainring((_: Chainring) => chainring);
            }}><Check /></IconButton>
            : <IconButton alt="Edit" size={1} onClick={() => setEditing(true)}><Gear /></IconButton>}
        </Toolbar>
      </Header>
      {editing 
        ? (
          <div className="flex w-full gap-2 flex-wrap">
            {chainring.map(ring => (
              <ActionBadge key={ring} onClick={() => removeRing(ring)} action={<X />}>{ring}</ActionBadge>
            ))}
            {adding
              ? <RingCreator addRing={addRing} />
              : <BadgeButton onClick={() => setAdding(true)}><Plus /></BadgeButton>}
          </div>
        )
        : chainring.join('-')
      }
    </Box>
  )
};