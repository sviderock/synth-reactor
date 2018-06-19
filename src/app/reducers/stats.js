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
  },
  lastDeletedBarID: null,
  barsOnStart: 1
};

export default function (state = initialState, action) {
  let bars, sample, index;
  switch (action.type) {

    case 'SET_STATS':
      return action;

    case 'ADD_SAMPLE':
      return {...state, samples: [...state.samples, action.sample]};

    case 'MUTE_SAMPLE':
      sample = state.samples.find(i => i.id === action.id);
      index = state.samples.indexOf(sample);
      sample.mute = action.mute;
      state.samples[index] = sample;
      return {...state, samples: state.samples};

    case 'DELETE_SAMPLE':
      sample = state.samples.find(i => i.id === action.id);
      index = state.samples.indexOf(sample);
      sample.deleted = true;
      state.samples[index] = sample;
      return {...state, samples: state.samples};

    case 'ADD_BAR':
      bars = state.bars;
      bars[action.index] = action.notes;
      return {...state, bars};

    case 'DELETE_BAR':
      console.log('Deleting bar: ', action.index);
      bars = state.bars.filter((bar, idx) => idx !== action.index);
      return {...state, bars, lastDeletedBarID: action.index};

    case 'CLEAR_DELETED_BAR_ID':
      return {...state, lastDeletedBarID: null};

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
      return {stats: action.stats};

    default:
      return state;
  }
}