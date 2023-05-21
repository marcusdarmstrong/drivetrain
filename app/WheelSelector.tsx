'use client';

import { useState } from 'react';
import { Header, Toolbar, Box, IconButton, Button, Row } from './ui';
import { Gear, Check } from './icons';
import type { Wheel } from './marshalling';

const ISO_WHEEL_SIZES = {
  "700c": 622,
  "650b": 584,
};

const WHEEL_SIZE_LOOKUP = Object.fromEntries(Object.entries(ISO_WHEEL_SIZES).map(([k, v]) => [v, k]));

type WheelSetter = (oldWheel: Wheel) => Wheel;

export default function WheelSelector({ wheel, setWheel }: { wheel: Wheel, setWheel: (setter: WheelSetter) => unknown }) {
  const { tire: initialTire, size: initialSize } = wheel;
  const [editing, setEditing] = useState(false);
  const [tire, setTire] = useState(initialTire);
  const [size, setSize] = useState(initialSize);

  return (
    <Box>
      <Header level="h3">
        <span>Wheel</span>
        <Toolbar>
          {editing
            ? <IconButton alt="Save" size={1} onClick={() => {
              setEditing(false);
              setWheel((_: Wheel) => ({ tire, size }));
            }}><Check /></IconButton>
            : <IconButton alt="Edit" size={1} onClick={() => setEditing(true)}><Gear /></IconButton>
          }
        </Toolbar>
      </Header>
      {editing
        ? <Row>
      {tire}mm
      <input className="w-32" type="range" min="18" max="110" value={tire} onChange={evt => setTire(parseInt(evt.target.value, 10))} />
      <select className="inline-block px-2 bg-white" onChange={evt => setSize(parseInt(evt.target.value, 10))} value={size}>
        {Object.entries(ISO_WHEEL_SIZES).map(([key, value]) => <option key={key} value={value}>{key}</option>)}
      </select>
    </Row>
        : (
          <div>
            {wheel.tire}mm&nbsp;&times;&nbsp;{WHEEL_SIZE_LOOKUP[wheel.size]}
          </div>
        )
      }
    </Box>
  );
};
