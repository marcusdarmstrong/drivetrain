'use client'

import { useState, useCallback } from 'react';
import { Box, IconButton, Button, Toolbar, Header, BadgeButton, ActionBadge, Row } from './ui';
import { Gear, Plus, X, Check } from './icons';
import type { Cassette } from './marshalling';

import { useCassetteReducer, type Brand, type Speed } from './useCassetteReducer';

import cassetteData from './cassettes.json';

const brands = Object.keys(cassetteData);

function CogCreator({ addCog }: { addCog: (cog: number) => unknown }) {
  const [cog, setCog] = useState('9');
  return (
    <ActionBadge onClick={() => addCog(parseInt(cog, 10))} action={<Plus />}>
      <input className="w-20 focus:outline-none focus:ring px-4 rounded-full bg-indigo-50" type="number" min={9} max={60} onChange={(evt) => setCog(evt.target.value)} value={cog}/>
    </ActionBadge>
  );
}

type CassetteSetter = (oldCassette: Cassette) => Cassette;

export default function CassetteSelector({ cassette: initialCassette, setCassette: setInitialCassette }: { cassette: Cassette, setCassette: (setter: CassetteSetter) => unknown }) {
  const [editing, setEditing] = useState(false);

  const [{ brand, speed, range, adding, cogs }, dispatch] = useCassetteReducer({ cogs: initialCassette });

	return (
		<Box>
      <Header level="h3">
        <span>Cassette {cogs !== null && <span className="text-sm">({cogs.length} speed)</span>}</span>
        <Toolbar>
          {editing
            ? (cogs !== null && 
                <IconButton alt="Save" size={1} onClick={() => {
                setEditing(false);
                setInitialCassette((_: Cassette) => cogs);
              }}><Check /></IconButton>)
            : <IconButton alt="Edit" size={1} onClick={() => setEditing(true)}><Gear /></IconButton>}
        </Toolbar>
      </Header>
      {editing 
        ? (
          <div className="flex w-full gap-2 flex-wrap">
            <Row>Select a Cassette</Row>
            <Row>
              <div className="flex w-full gap-2 flex-wrap">
                <select className="inline-block px-2 bg-white border border-slate-100" value={brand ?? undefined} onChange={(evt) => dispatch.selectBrand(evt.target.value as Brand)}>
                  <option>Custom</option>
                  {brands.map(brandName => <option value={brandName} key={brandName}>{brandName}</option>)}
                </select>
                {brand !== null && (
                  <>
                    <select className="inline-block px-2 bg-white border border-slate-100" value={speed ?? undefined} onChange={(evt) => dispatch.selectSpeed(evt.target.value as Speed)}>
                      <option>Speed</option>
                      {Object.keys(cassetteData[brand]).map(speedName => <option value={speedName} key={speedName}>{speedName} speed</option>)}
                    </select>
                    {speed !== null && (
                      <select className="inline-block px-2 bg-white border border-slate-100" value={range ?? undefined} onChange={(evt) => dispatch.selectRange(evt.target.value)}>
                        <option>Range</option>
                        {Object.keys(cassetteData[brand][speed]).map(rangeName => <option value={rangeName} key={rangeName}>{rangeName}</option>)}
                      </select> 
                    )}
                  </>
                )}
              </div>
            </Row>
            {brand === null
              ? (
                <>
                  <Row>Customize</Row>
                  {cogs.map(cog => (
                    <ActionBadge key={cog} onClick={() => dispatch.removeCog(cog)} action={<X />}>{cog}</ActionBadge>
                  ))}
                  {adding
                    ? <CogCreator addCog={dispatch.addCog} />
                    : <BadgeButton onClick={() => dispatch.createCog()}><Plus /></BadgeButton>}
                </>
              )
              : (cogs !== null && cogs.join('-'))}
          </div>
        )
        : cogs.join('-')
      }
		</Box>
	)
};