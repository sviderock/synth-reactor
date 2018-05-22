const initialState = {
  bpm: 120,
  playing: false,
  currentBeat: 0,
  bars: [],
  samples: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_STATS':
      return action;
    case 'ADD_SAMPLE':
      return {...state, samples: [...state.samples, action.sample]};
    case 'ADD_BAR':
      return {...state, bars: [...state.bars, action.bar]};
    case 'SET_PLAY':
      return {...state, playing: action.playing};
    default:
      return state;
  }
}