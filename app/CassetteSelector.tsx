'use client'

import { useState, useCallback } from 'react';
import { Box, IconButton, Button, Toolbar, Header, BadgeButton, ActionBadge, Row } from './ui';
import { Gear, Plus, X, Check } from './icons';
import type { Cassette } from './marshalling';

function CogCreator({ addCog }: { addCog: (cog: string) => unknown }) {
  const [cog, setCog] = useState('9');
  return (
    <ActionBadge onClick={() => addCog(cog)} action={<Plus />}>
      <input className="w-20 focus:outline-none focus:ring px-4 rounded-full bg-indigo-50" type="number" min={9} max={60} onChange={(evt) => setCog(evt.target.value)} value={cog}/>
    </ActionBadge>
  );
}

type CassetteSetter = (oldCassette: Cassette) => Cassette;

export default function CassetteSelector({ cassette: initialCassette, setCassette: setInitialCassette }: { cassette: Cassette, setCassette: (setter: CassetteSetter) => unknown }) {
  const [editing, setEditing] = useState(false);
  const [cassette, setCassette] = useState(initialCassette);
  const [adding, setAdding] = useState(false);

  const addCog = useCallback((newCog: string) => {
    setCassette(
      (cogs: Cassette) => 
        [...new Set(
          [...cogs, parseInt(newCog, 10)]
        )].sort((a, b) => a - b)
    );
    setAdding(false);
  }, []);

  const removeCog = useCallback((toRemove: number) => {
    setCassette(
      (cogs: Cassette) => cogs.filter(cog => cog !== toRemove)
    );
  }, []);

	return (
		<Box>
      <Header level="h3">
        <span>Cassette <span className="text-sm">({cassette.length} speed)</span></span>
        <Toolbar>
          {editing 
            ? <IconButton alt="Save" size={1} onClick={() => {
              setEditing(false);
              setInitialCassette((_: Cassette) => cassette);
            }}><Check /></IconButton>
            : <IconButton alt="Edit" size={1} onClick={() => setEditing(true)}><Gear /></IconButton>}
        </Toolbar>
      </Header>
      {editing 
        ? (
          <div className="flex w-full gap-2 flex-wrap">
            {cassette.map(cog => (
              <ActionBadge key={cog} onClick={() => removeCog(cog)} action={<X />}>{cog}</ActionBadge>
            ))}
            {adding
              ? <CogCreator addCog={addCog} />
              : <BadgeButton onClick={() => setAdding(true)}><Plus /></BadgeButton>}
          </div>
        )
        : cassette.join('-')
      }
		</Box>
	)
};