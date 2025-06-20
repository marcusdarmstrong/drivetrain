import cassetteData from './cassettes.json';
import { useReducer, useMemo } from 'react';

type Brand = 'Shimano' | 'SRAM' | 'Campagnolo';
type Series = string;
type Model = string;
type Range = string;
type State = {
  brand: null | Brand,
  series: null | Series,
  model: null | Model,
  range: null | Range,
  cogs: null | number[],
  adding: boolean,
};

type Action = {
  type: 'select brand',
  brand: Brand,
} | {
  type: 'select series',
  series: Series,
} | {
  type: 'select model',
  model: Model,
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
  series: Series,
  model: null | Model,
  range: Range,
};

function getCogs({brand, series, model, range}: CassetteSpec) {
  return brand === 'Campagnolo'
    ? cassetteData[brand][series][range]
    : cassetteData[brand][series][model][range];
}

function reducer({ brand, series, model, range, cogs, adding }: State, action: Action) {
  switch (action.type) {
    case 'select brand':
      return ({
        brand: action.brand,
        series: null,
        model: null,
        range: null,
        cogs: null,
        adding: false,
      });
    case 'select series':
      return ({
        brand,
        series: action.series,
        model: null,
        range: null,
        cogs: null,
        adding: false,
      });
    case 'select model':
      return ({
        brand,
        series,
        model: action.model,
        range: null,
        cogs: null,
        adding: false,
      });
    case 'select range':
      return ({
        brand,
        series,
        model,
        range: action.range,
        cogs: getCogs({ brand, series, model, range: action.range }),
        adding: false,
      });
    case 'create cog':
      return ({
        brand,
        series,
        model,
        range,
        cogs, 
        adding: true,
      });
    case 'add cog':
      return ({
        brand,
        series,
        model,
        range,
        cogs: [...new Set([...cogs, action.cog].sort())], 
        adding: false,
      });
    case 'remove cog':
      return ({
        brand,
        series,
        model,
        range,
        cogs: cogs.filter((cog) => cog !== action.cog), 
        adding: false,
      });
    default:
      return state;
  }
}

export function useCassetteReducer(initialCassette) {
  const [state, dispatch] = useReducer(reducer, {
    brand: null,
    series: null,
    model: null,
    range: null,
    cogs: null,
    ...initialCassette,
    adding: false,
  });

  return useMemo(() => [
    state,
    {
      selectBrand(brand: Brand) {
        dispatch({ type: 'select brand', brand});
      },
      selectSeries(series: Series) {
        dispatch({ type: 'select series', series });
      },
      selectModel(model: Model) {
        dispatch({ type: 'select model', model });
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
    }
  ], [state, dispatch])
}
