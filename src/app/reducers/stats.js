import {genId} from "../components/common/helpers";

const initialState = {
  bpm: 120,
  playing: false,
  bars: [],
  samples: [
    // {id: genId('sample'), name: 'Kick', src: '/static/samples/kicks/kick_1.wav'},
    // {id: genId('sample'), name: 'Snare', src: '/static/samples/snares/snare_4.wav'},
    // {id: genId('sample'), name: 'Hi-hat', src: '/static/samples/hihats/hihat_008a.wav'},
  ],
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

    case 'MUTE_SAMPLE':
      let sample = state.samples.find(i => i.id === action.id);
      const index = state.samples.indexOf(sample);
      sample.mute = action.mute;
      state.samples[index] = sample;
      return {...state, samples: state.samples};

    case 'DELETE_SAMPLE':
      return {...state, samples: state.samples.filter(sample => sample.id !== action.id)};

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

    case 'REINIT_STATS':
      console.log(action.stats);
      return {stats: action.stats};

    default:
      return state;
  }
}