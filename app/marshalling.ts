export const parseCadence = (serialized: string): PartialCadence => {
  if (serialized === undefined || serialized === null || serialized === '') {
    return { min: null, max: null };
  }
  try {
    const cadenceSpec = serialized.split('-').map((rpm: string) => {
      if (rpm.length > 0) {
        return parseInt(rpm, 10);
      }
      return null;
    });
    return {
      min: cadenceSpec[0] ?? null,
      max: cadenceSpec[1] ?? null,
    };
  } catch (e) {
    console.error('Could not parse cadence:', e);
    return { min: null, max: null };
  }
};

export type Drivetrain = {
  readonly cassette: Cassette,
  readonly chainring: Chainring,
  readonly wheel: Wheel,
};

export type PartialDrivetrain = {
  readonly cassette: Cassette,
  readonly chainring: Chainring,
  readonly wheel: PartialWheel,
};

export type Cadence = {
  readonly min: number,
  readonly max: number,
};

export type PartialCadence = {
  readonly min: null | number,
  readonly max: null | number,
};

export type Wheel = {
  readonly tire: number,
  readonly size: number,
};

export type PartialWheel = {
  readonly tire: null | number,
  readonly size: null | number,
};

export type Cassette = ReadonlyArray<number>;
export type Chainring = ReadonlyArray<number>;


export const realizeCadence = (cadence: PartialCadence): Cadence => {
  return {
    min: cadence.min ?? 85,
    max: cadence.max ?? 100,
  };
}

export const realizeDrivetrain = (drivetrain: Partial<Drivetrain>): Drivetrain => {
  return {
    cassette: drivetrain.cassette?.length ?? 0 > 0
      ? drivetrain.cassette as Cassette
      : [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30, 34],
    chainring: drivetrain.chainring?.length ?? 0 > 0 
      ? drivetrain.chainring as Chainring
      : [34, 50],
    wheel: {
      tire: drivetrain.wheel?.tire ?? 28,
      size: drivetrain.wheel?.size ?? 622,
    },
  }
}

const parseCassette = (serialized: string): Cassette => {
  return serialized.split('-').map(cog => parseInt(cog, 10)).filter(Boolean).sort((a, b) => a - b);
};

const parseChainring = (serialized: string): Chainring => {
  return serialized.split('-').map(ring => parseInt(ring, 10)).filter(Boolean).sort((a, b) => a - b);
};

const parseWheel = (serialized: string): PartialWheel => {
  const wheelSpec = serialized.split('-').map(slice => {
    if (slice.length > 0) {
      return parseInt(slice, 10);
    }
    return null;
  });
  return {
    tire: wheelSpec[0] ?? null,
    size: wheelSpec[1] ?? null,
  };
};

export const parseDrivetrain = (serialized: string): PartialDrivetrain | null => {
  try {
    const split = serialized.split('_');
    return {
      cassette: parseCassette(split[0]),
      chainring: parseChainring(split[1]),
      wheel: parseWheel(split[2]),
    }
  } catch (e) {
    console.error('Unable to parse Drivetrain:', e);
    return null;
  }
};

const serializeCassette = (cassette: Cassette): string => {
  const literalSerialization = cassette.join('-');
  if (literalSerialization === '11-12-13-14-15-17-19-21-24-27-30-34'){
    return '';
  }
  return literalSerialization;
};

const serializeChainring = (chainring: Chainring): string => {
  const literalSerialization = chainring.join('-');
  if (literalSerialization === '34-50') {
    return '';
  }
  return literalSerialization;
};

export const serializeCadence = (cadence: Cadence): string => {
  if (cadence.min === 85 && cadence.max === 100) {
    return '';
  }
  if (cadence.min !== null || cadence.max !== null) {
    return `${
      cadence.min === 85 ? '' : cadence.min ?? ''
    }-${
      cadence.max === 100 ? '' : cadence.max ?? ''
    }`;
  }
  return '';
};

const serializeWheel = (wheel: Wheel): string => {
  if (wheel.tire !== undefined || wheel.size !== undefined) {
    return `${wheel.tire ?? ''}-${wheel.size ?? ''}`;
  }
  return '';
};

export const serializeDrivetrain = (drivetrain: Drivetrain): string => {
  return `${
    serializeCassette(drivetrain.cassette)
  }_${
    serializeChainring(drivetrain.chainring)
  }_${
    serializeWheel(drivetrain.wheel)
  }`;
};