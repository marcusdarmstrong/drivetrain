'use client';

import { useState } from 'react';
import { Button } from './ui';

const ISO_WHEEL_SIZES = {
  "29er/700c (ISO 622)": 622,
  "27.5/650b (ISO 584)": 584,
};

const WHEEL_SIZE_LOOKUP = Object.fromEntries(Object.entries(ISO_WHEEL_SIZES).map(([k, v]) => [v, k]));

function WheelEditor({ initialTire, initialSize, setWheel }) {
  const [tire, setTire] = useState(initialTire);
  const [size, setSize] = useState(initialSize);

  return (
    <>
      {tire}
      <input type="range" min="18" max="110" value={tire} onChange={evt => setTire(parseInt(evt.target.value, 10))} />
      <select onChange={evt => setSize(parseInt(evt.target.value, 10))} value={size}>
        {Object.entries(ISO_WHEEL_SIZES).map(([key, value]) => <option key={key} value={value}>{key}</option>)}
      </select>
      <Button onClick={() => setWheel({ tire, size })}>Save</Button>
    </>
  );
}

export default function WheelSelector({ wheel, setWheel }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="flex">
        <h3 className="text-xl leading-10">Wheel</h3>
        <Button onClick={() => setEditing(true)}>Edit</Button>
      </div>
      {editing
        ? <WheelEditor initialTire={wheel.tire} initialSize={wheel.size} setWheel={
          (newWheel) => {
            setEditing(false);
            setWheel(_ => newWheel);
          }}/>
        : (
          <div className="flex justify-between">
            <span>Tire: {wheel.tire}mm</span>
            <span>Size: {WHEEL_SIZE_LOOKUP[wheel.size]}</span>
          </div>
        )
      }
    </div>
  );
};
