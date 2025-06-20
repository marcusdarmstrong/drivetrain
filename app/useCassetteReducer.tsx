import cassetteData from './cassettes.json';
import { useReducer, useMemo } from 'react';

export type Brand = 'Shimano' | 'SRAM' | 'Campagnolo';
export type Speed = '11' | '12' | '13';
type Range = string;
type State = {
  brand: null | Brand,
  speed: null | Speed,
  range: null | Range,
  cogs: readonly number[],
  adding: boolean,
};

type Action = {
  type: 'select brand',
  brand: Brand,
} | {
  type: 'select speed',
  speed: Speed,
} | {
  type: 'select range',
  range: Range,
} | {
  type: 'create cog',
} | {
  type: 'add cog',
  cog: number,
} | {
  type: 'remove cog',
  cog: number,
};

type CassetteSpec = {
  brand: Brand,
  speed: Speed,
  range: Range,
};

type CassetteData = {
  [brand in Brand]: {
    [speed in Speed]: {
      [range: Range]: readonly number[];
    };
  };
};

function getCogs({ brand, speed, range }: CassetteSpec) {
  return (cassetteData as CassetteData)[brand][speed][range]!;
}

function reducer({ brand, speed, range, cogs, adding }: State, action: Action): State {
  switch (action.type) {
    case 'select brand':
      return ({
        brand: action.brand,
        speed: null,
        range: null,
        cogs: [],
        adding: false,
      });
    case 'select speed':
      return ({
        brand,
        speed: action.speed,
        range: null,
        cogs: [],
        adding: false,
      });
    case 'select range':
      return ({
        brand,
        speed,
        range: action.range,
        cogs: getCogs({ brand: brand!, speed: speed!, range: action.range }),
        adding: false,
      });
    case 'create cog':
      return ({
        brand,
        speed,
        range,
        cogs, 
        adding: true,
      });
    case 'add cog':
      return ({
        brand,
        speed,
        range,
        cogs: [...new Set([...cogs, action.cog].sort())], 
        adding: false,
      });
    case 'remove cog':
      return ({
        brand,
        speed,
        range,
        cogs: cogs.filter((cog) => cog !== action.cog), 
        adding: false,
      });
    default: {
      // const unreachable: never = action.type;
      throw new Error("unreachable");
    }
  }
}

export function useCassetteReducer(initialCassette: { cogs: readonly number[] }): [State, {
  selectBrand(brand: Brand): void,
  selectSpeed(speed: Speed): void,
  selectRange(range: Range): void,
  createCog():void,
  addCog(cog: number): void,
  removeCog(cog: number): void,
}] {
  const [state, dispatch] = useReducer<State, [Action]>(reducer, {
    brand: null,
    speed: null,
    range: null,
    ...initialCassette,
    adding: false,
  });

  return useMemo(() => [
    state,
    {
      selectBrand(brand: Brand) {
        dispatch({ type: 'select brand', brand});
      },
      selectSpeed(speed: Speed) {
        dispatch({ type: 'select speed', speed });
      },
      selectRange(range: Range) {
        dispatch({ type: 'select range', range });
      },
      createCog() {
        dispatch({ type: 'create cog' });
      },
      addCog(cog: number) {
        dispatch({ type: 'add cog', cog });
      },
      removeCog(cog: number) {
        dispatch({ type: 'remove cog', cog });
      },
    } as const
  ], [state, dispatch])
}
