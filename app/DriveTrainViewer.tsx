'use client';

import type { Cadence, Drivetrain } from './marshalling';
import { Header, Row } from './ui';
import { useState, useId } from 'react';
type Gear = [number, number, number, number, number, boolean];

const mmPerMinuteToMph = 60 / 1000 / 1609.34;

const round = (num: number, dec: number = 2) => {
  let str = String(Math.round(num * (10 ** dec)) / (10 ** dec));
  if (!str.includes('.')) {
    str = `${str}.`;
  }

  return str.padEnd(str.indexOf('.') + 1 + dec, '0');
}

const isCrossChained = (ringIndex: number, cogIndex: number, ringCount: number, cogCount: number) => {
  if (ringCount === 2) {
    if (ringIndex === 0) { 
      if (cogIndex < 2) {
        return true;
      }
      return false;
    }
    if (cogIndex > cogCount - 1 - 2) {
      return true;
    }
    return false;
  }
  // We're just not going to support 3-ring cranks
  return false;
};

const isUsefulGear = (ratio: number, previousRatio: number | null, nextRatio: number | null) => {
  if (previousRatio) {
    const usefulVsPrev = (previousRatio - ratio) / ratio > .05;
    if (nextRatio) {
      const usefulVsNext = (ratio - nextRatio) / ratio > .05;
      return usefulVsPrev && usefulVsNext;
    }
    return usefulVsPrev;
  }
  if (nextRatio) {
    const usefulVsNext = (ratio - nextRatio) / ratio > .05;
    return usefulVsNext;
  }
  return true;
};

const getUsefulGearCount = (gears: Gear[], shiftPoint: number) => {
  let usefulCount = 0;
  gears.filter(
    (gear, index) => 
      (index < shiftPoint && gear[0] == gears[0][0]) || 
      (index >= shiftPoint && gear[0] !== gears[0][0])).forEach((gear: Gear, index: number) => {
    if (isUsefulGear(gear[2], (gears[index - 1]?? [])[2] ?? null, (gears[index + 1]??[])[2] ?? null)) {
      usefulCount++;
    }
  });
  return usefulCount;
}

const findShiftPoint = (sortedGears: Gear[]) => {
  const nonCrossChainedGears = sortedGears.filter((gear: Gear) => gear[5]);
  const firstPossibleShiftIndex = nonCrossChainedGears.findIndex((gear: Gear) => gear[0] !== nonCrossChainedGears[0][0]);
  const lastPossibleShiftIndex = nonCrossChainedGears.findLastIndex((gear: Gear) => gear[0] !== nonCrossChainedGears[nonCrossChainedGears.length - 1][0]);

  let bestShiftPoint = firstPossibleShiftIndex;
  let bestShiftPointGearCount = getUsefulGearCount(nonCrossChainedGears, bestShiftPoint);
  for (let shiftPoint = firstPossibleShiftIndex; shiftPoint < lastPossibleShiftIndex; shiftPoint++) {
    const usefulGearCount = getUsefulGearCount(nonCrossChainedGears, shiftPoint);
    if (usefulGearCount >= bestShiftPointGearCount) {
      bestShiftPointGearCount = usefulGearCount;
      bestShiftPoint = shiftPoint;
    }
  }

  return sortedGears.findIndex((gear: Gear) => gear === nonCrossChainedGears[bestShiftPoint]);
}

export default function DriveTrainViewer({ cadence, drivetrain }: { cadence: Cadence, drivetrain: Drivetrain }) {
  const wheelCircumference_mm = Math.PI * (drivetrain.wheel.tire * 2 + drivetrain.wheel.size);
  
  const gears: Gear[] = drivetrain.chainring.flatMap((chainring: number, ringIndex: number) => {
    return drivetrain.cassette.map((cog: number, cogIndex: number) => {
      const gearRatio = chainring / cog;
      const mphLow = gearRatio * cadence.min * wheelCircumference_mm * mmPerMinuteToMph;
      const mphHigh = gearRatio * cadence.max * wheelCircumference_mm * mmPerMinuteToMph;
      return [
        chainring,
        cog,
        gearRatio,
        mphLow,
        mphHigh,
        !isCrossChained(ringIndex, cogIndex, drivetrain.chainring.length, drivetrain.cassette.length),
      ] as Gear;
    })
  });

  gears.sort((a: Gear, b: Gear): number => b[2] - a[2]);

  if (drivetrain.chainring.length > 1) {
    const shiftPoint = findShiftPoint(gears);

    // Mark unreachable gears unavailable
    gears.forEach((gear: Gear, index: number) => {
      gear[5] &&= 
        (index < shiftPoint && gear[0] == gears[0][0]) || 
        (index >= shiftPoint && gear[0] !== gears[0][0]);
    });
  }

  const usefulCount = gears.filter((gear: Gear) => gear[5]).length;

  const [ showNonfunctionalGears, setShowNonfunctionalGears ] = useState(false);
  const labelId = useId();
  return (
    <div className="w-full">
      <Header level="h3"><span>Gearing <span className="text-sm">({usefulCount} functional gears)</span></span></Header>
      {usefulCount !== gears.length
        ? (
          <Row>
            <div>
              <input id={labelId} type="checkbox" checked={showNonfunctionalGears} onChange={() => setShowNonfunctionalGears(prev => !prev)} />
              <label htmlFor={labelId} className="inline-block p-1">Show non-functional gears</label>
            </div>
          </Row>
        )
        : null}
      <table className="w-full text-xs leading-none">
        <thead>
          <tr>
            <th className="text-left">Gearing</th>
            <th className="text-left">Ratio</th>
            <th>Speed (mph)</th></tr>
        </thead>
        <tbody>
        {
          gears.filter((gear) => showNonfunctionalGears || gear[5] ).map((gear: Gear, idx: number) => {
            return (
              <tr key={idx} className={gear[5] ? '' : 'text-slate-400'}>
                <td className="w-16">{gear[0]}&nbsp;&times;&nbsp;{gear[1]}</td>
                <td className="w-12">{round(gear[2])}</td>
                <td>
                  <span className="inline-block text-right" style={{
                    width: `${gear[3] * 2}%`,
                  }}>{round(gear[3], 1)}&nbsp;</span>
                  <span 
                    className={`inline-block ${gear[5] ? 'bg-green-600' : "bg-green-600/20"}`}
                    style={{
                      width: `${(gear[4] - gear[3]) * 2}%`,
                      height: `.5rem`,
                    }}></span>
                  <span className="inline-block text-left">&nbsp;{round(gear[4], 1)}</span>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
};
