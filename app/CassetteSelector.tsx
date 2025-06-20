'use client'

import { useState, useCallback } from 'react';
import { Box, IconButton, Button, Toolbar, Header, BadgeButton, ActionBadge, Row } from './ui';
import { Gear, Plus, X, Check } from './icons';
import type { Cassette } from './marshalling';

import { useCassetteReducer } from './useCassetteReducer';

import cassetteData from './cassettes.json';

const brands = Object.keys(cassetteData);

function CogCreator({ addCog }: { addCog: (cog: string) => unknown }) {
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

  const [{ brand, series, model, range, adding, cogs }, dispatch] = useCassetteReducer({ cogs: initialCassette });

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
                <select className="inline-block px-2 bg-white border border-slate-100" value={brand} onChange={(evt) => dispatch.selectBrand(evt.target.value)}>
                  <option value={null}>Custom</option>
                  {brands.map(brandName => <option value={brandName}>{brandName}</option>)}
                </select>
                {brand !== null && (
                  <>
                    <select className="inline-block px-2 bg-white border border-slate-100" value={series} onChange={(evt) => dispatch.selectSeries(evt.target.value)}>
                      <option value={null}>Series</option>
                      {Object.keys(cassetteData[brand]).map(seriesName => <option value={seriesName}>{seriesName}</option>)}
                    </select>
                    {series !== null &&
                      (brand === 'Campagnolo'
                        ? (
                          <select className="inline-block px-2 bg-white border border-slate-100" value={range} onChange={(evt) => dispatch.selectRange(evt.target.value)}>
                            <option value={null}>Range</option>
                            {Object.keys(cassetteData[brand][series]).map(rangeName => <option value={rangeName}>{rangeName}</option>)}
                          </select>
                        )
                        : (
                          <>
                            <select className="inline-block px-2 bg-white border border-slate-100" value={model} onChange={(evt) => dispatch.selectModel(evt.target.value)}>
                              <option value="Model">Model</option>
                              {Object.keys(cassetteData[brand][series]).map(modelName => <option value={modelName}>{modelName}</option>)}
                            </select>
                            {model !== null && (
                              <select className="inline-block px-2 bg-white border border-slate-100" value={range} onChange={(evt) => dispatch.selectRange(evt.target.value)}>
                                <option value={null}>Range</option>
                                {Object.keys(cassetteData[brand][series][model]).map(rangeName => <option value={rangeName}>{rangeName}</option>)}
                              </select>
                            )}
                          </>
                        )
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