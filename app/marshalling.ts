export const parseCadence = (serialized) => {
  if (serialized === undefined || serialized === null || serialized === '') {
    return { min: null, max: null };
  }
  try {
    const cadenceSpec = serialized.split('-').map(rpm => {
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

export const realizeCadence = (cadence) => {
  return {
    min: cadence.min ?? 85,
    max: cadence.max ?? 110,
  };
}

export const realizeDrivetrain = (drivetrain) => {
  return {
    cassette: drivetrain.cassette?.length > 0
      ? drivetrain.cassette
      : [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30, 34],
    chainring: drivetrain.chainring?.length > 0 
      ? drivetrain.chainring
      : [34, 50],
    wheel: {
      tire: drivetrain.wheel?.tire ?? 28,
      size: drivetrain.wheel?.size ?? 622,
    },
  }
}

const parseCassette = (serialized) => {
  return serialized.split('-').map(cog => parseInt(cog, 10)).filter(Boolean).sort((a, b) => a - b);
};

const parseChainring = (serialized) => {
  return serialized.split('-').map(ring => parseInt(ring, 10)).filter(Boolean).sort((a, b) => a - b);
};

const parseWheel = (serialized) => {
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

export const parseDrivetrain = (serialized) => {
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

const serializeCassette = (cassette) => {
  const literalSerialization = cassette.join('-');
  if (literalSerialization === '11-12-13-14-15-17-19-21-24-27-30-34'){
    return '';
  }
  return literalSerialization;
};

const serializeChainring = (chainring) => {
  const literalSerialization = chainring.join('-');
  if (literalSerialization === '34-50') {
    return '';
  }
  return literalSerialization;
};

export const serializeCadence = (cadence) => {
  if (cadence.min !== null || cadence.max !== null) {
    return `${
      cadence.min === 85 ? '' : cadence.min ?? ''
    }-${
      cadence.max === 110 ? '' : cadence.max ?? ''
    }`;
  }
  return '';
};

const serializeWheel = (wheel) => {
  if (wheel.tire !== undefined || wheel.size !== undefined) {
    return `${wheel.tire ?? ''}-${wheel.size ?? ''}`;
  }
  return '';
};

export const serializeDrivetrain = (drivetrain) => {
  return `${
    serializeCassette(drivetrain.cassette)
  }_${
    serializeChainring(drivetrain.chainring)
  }_${
    serializeWheel(drivetrain.wheel)
  }`;
};