'use client'

import { useState, useCallback } from 'react';
import { Button } from './ui';

function CogCreator({ addCog }) {
  const [cog, setCog] = useState('9');
  return (
    <>
      <input className="bg-slate-400" type="number" min={9} max={60} onChange={(evt) => setCog(evt.target.value)} value={cog}/>
      <Button type="button" onClick={() => addCog(cog)}>Add cog</Button>
    </>
  );
}

function CassetteEditor({ initialCassette, saveCassette }) {
  const [adding, setAdding] = useState(false);
  const [cassette, setCassette] = useState(initialCassette);

  const addCog = useCallback((newCog) => {
    setCassette(
      (cogs) => 
        [...new Set(
          [...cogs, parseInt(newCog, 10)]
        )].sort((a, b) => a - b)
    );
    setAdding(false);
  }, []);

  const removeCog = useCallback((toRemove) => {
    setCassette(
      (cogs) => cogs.filter(cog => cog !== toRemove)
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
        : <Button type="button" onClick={() => setAdding(true)}>Add a Cog</Button>}
      <Button onClick={() => saveCassette(cassette)}>Save</Button>
    </>
  );
}

export default function CassetteSelector({ cassette, setCassette }) {
  const [editing, setEditing] = useState(false);

	return (
		<div>
      <div className="flex">
        <h3 className="text-xl leading-10">Cassette: <span className="text-sm">({cassette.length} speed)</span></h3>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>
      {editing 
        ? <CassetteEditor initialCassette={cassette} saveCassette={(newCassette) => {
          setEditing(false);
          setCassette(_ => newCassette);
        }} />
        : <ol>
          {cassette.map(cog => (
            <li className="inline-block p-1" key={cog}>
              {cog}
            </li>
          ))}
        </ol>
      }
		</div>
	)
};