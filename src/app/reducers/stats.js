const initialState = {
  bpm: 120,
  playing: false,
  bars: [],
  samples: [],
  beat: 0,
  note: 0,
  tick: {
    bar: 0,
    beat: 0,
    note: 0
  }
};

export default function (state = initialState, action) {
  let bars;
  switch (action.type) {

    case 'SET_STATS':
      return action;

    case 'ADD_SAMPLE':
      return {...state, samples: [...state.samples, action.sample]};

    case 'ADD_BAR':
      bars = state.bars;
      bars[action.index] = action.notes;
      return {...state, bars};

    case 'DELETE_BARS':
      return {...state, bars: []};

    case 'SET_PLAY':
      return {...state, playing: action.playing};

    case 'SWITCH_NOTE_IN_BAR':
      bars = state.bars;
      const idx = action.noteIndex;
      let notes = bars[action.index][action.sampleIndex].notes;
      notes.includes(idx) ? notes.splice(notes.indexOf(idx), 1) : notes.push(idx);
      return {...state, bars};

    case 'SET_TICK':
      return {...state, ...action.tick};

    case 'SET_BPM':
      return {...state, bpm: action.bpm};

    default:
      return state;
  }
}