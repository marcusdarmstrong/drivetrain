'use client';

import { useState, useCallback } from 'react';

import { useSearchParamNavigationCallback, params } from './navigation';
import { serializeCadence, type Cadence } from './marshalling';
import { IconButton, Button, Box, Header, Toolbar, Row } from './ui';
import { Gear, Trash, Plus, Check } from './icons';

type CadenceSetter = (oldCadence: Cadence) => Cadence;

export default function CadenceSelector({ cadence: initialCadence }: { cadence: Cadence }) {
  const [max, setMax] = useState(initialCadence.max);
  const [min, setMin] = useState(initialCadence.min);
  const [editing, setEditing] = useState(false);

  // @ts-expect-error: TODO
  const setCadence = useSearchParamNavigationCallback(params.cadence, useCallback((newCadence: CadenceSetter) => {
    return serializeCadence(newCadence(initialCadence));
  }, [initialCadence]));

  return (
    <Box>
      <Header level="h3">
        Cadence
        <Toolbar>
          {editing
            ?<IconButton alt="Save" size={1} onClick={() => {
              setEditing(false);
              setCadence((_: Cadence) => ({ min, max }));
            }}><Check /></IconButton>
            : <IconButton alt="Edit" size={1} onClick={() => setEditing(true)}><Gear /></IconButton>
          }
        </Toolbar>
      </Header>
      <div>
        {editing
          ? <Row>
            {min}rpm
            <input type="range" min="50" max={max} value={min} onChange={evt => setMin(parseInt(evt.target.value, 10))} />
            –
            {max}rpm
            <input type="range" min={min} max="150" value={max} onChange={evt => setMax(parseInt(evt.target.value, 10))} />
          </Row>
          : (
            <div>{min}–{max}rpm</div>
          )
        }
      </div>
    </Box>
  );
};
