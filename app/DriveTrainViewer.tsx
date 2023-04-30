'use client';

import type { Cadence, Drivetrain } from './marshalling';

type Gear = [number, number, number, number, number, boolean];

const mmPerMinuteToMph = 60 / 1000 / 1609.34;

const round = (num: number, dec: number = 2) => Math.round(num * (10 ** dec)) / (10 ** dec);

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
  let useful = previousRatio === null && nextRatio === null;
  if (previousRatio) {
    useful ||= (previousRatio - ratio) / ratio > .05;
  }
  if (nextRatio) {
    useful ||= (ratio - nextRatio) / ratio > .05;
  }
  return useful;
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

  let usefulCount = 0;
  gears.filter((gear: Gear) => gear[5]).forEach((gear: Gear, index: number) => {
    if (isUsefulGear(gear[2], gears[index - 1]?.[2] ?? null, gears[index + 1]?.[2] ?? null)) {
      usefulCount++;
    }
  });

  return (
    <div>
      <h3 className="text-xl">Gearing <span className="text-sm">({usefulCount} functional gears)</span></h3>
      <div className="flex">
        <ol className="w-1/2 text-xs">
        {
          gears.map((gear: Gear, idx: number) => {
            return <li key={idx} className={gear[5] ? '' : 'text-slate-700'}>
              {gear[0]} x {gear[1]} = {round(gear[2])}
              &nbsp;=&gt; {round(gear[3], 1)}..{round(gear[4], 1)}mph
              </li>
          })
        }
        </ol>
        <div className="w-1/2">
          {
            gears.map((gear: Gear, idx: number) => (
              <div key={idx} style={{
                width: `${(gear[4] - gear[3]) * 2}%`,
                marginLeft: `${gear[3] * 2}%`,
                height: `1rem`,
              }} className={gear[5] ? 'bg-sky-500' : "bg-sky-500/20"}></div>
            ))
          }
        </div>
      </div>
    </div>
  );
};
