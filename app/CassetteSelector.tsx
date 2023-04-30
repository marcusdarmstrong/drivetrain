'use client'

import { useState, useCallback } from 'react';
import { Button } from './ui';

import type { Cassette } from './marshalling';

function CogCreator({ addCog }: { addCog: (cog: string) => unknown }) {
  const [cog, setCog] = useState('9');
  return (
    <>
      <input className="bg-slate-400" type="number" min={9} max={60} onChange={(evt) => setCog(evt.target.value)} value={cog}/>
      <Button onClick={() => addCog(cog)}>Add cog</Button>
    </>
  );
}

type CassetteSetter = (oldCassette: Cassette) => Cassette;

function CassetteEditor({ initialCassette , saveCassette }: { initialCassette: Cassette, saveCassette: (newCassette: Cassette) => unknown }) {
  const [adding, setAdding] = useState(false);
  const [cassette, setCassette] = useState(initialCassette);

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
    <>
      <ol>
        {cassette.map(cog => (
          <li className="inline-block" key={cog}>
            <Button onClick={() => removeCog(cog)}>{cog}</Button>
          </li>
        ))}
      </ol>
      {adding
        ? <CogCreator addCog={addCog} />
        : <Button onClick={() => setAdding(true)}>Add a Cog</Button>}
      <Button onClick={() => saveCassette(cassette)}>Save</Button>
    </>
  );
}

export default function CassetteSelector({ cassette, setCassette }: { cassette: Cassette, setCassette: (setter: CassetteSetter) => unknown }) {
  const [editing, setEditing] = useState(false);

	return (
		<div>
      <div className="flex">
        <h3 className="text-xl leading-10">Cassette: <span className="text-sm">({cassette.length} speed)</span></h3>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>
      {editing 
        ? <CassetteEditor initialCassette={cassette} saveCassette={(newCassette: Cassette) => {
          setEditing(false);
          setCassette((_: Cassette) => newCassette);
        }} />
        : <ol>
          {cassette.map((cog: number) => (
            <li className="inline-block p-1" key={cog}>
              {cog}
            </li>
          ))}
        </ol>
      }
		</div>
	)
};