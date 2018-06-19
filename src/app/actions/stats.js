export function setStats(stats) {
  return {
    type: 'SET_STATS',
    stats
  };
}

export function addSample(sample) {
  return {
    type: 'ADD_SAMPLE',
    sample
  };
}

export function muteSample(id, mute) {
  return {
    type: 'MUTE_SAMPLE',
    id,
    mute
  };
}

export function deleteSample(id) {
  return {
    type: 'DELETE_SAMPLE',
    id
  };
}

export function addBar(index, notes) {
  return {
    type: 'ADD_BAR',
    index,
    notes
  };
}

export function deleteBar(index) {
  return {
    type: 'DELETE_BAR',
    index
  };
}

export function clearDeletedBarID() {
  return {
    type: 'CLEAR_DELETED_BAR_ID'
  };
}

export function switchNoteInBar(index, noteIndex, sampleIndex) {
  return {
    type: 'SWITCH_NOTE_IN_BAR',
    index,
    noteIndex,
    sampleIndex
  };
}

export function setPlay(playing) {
  return {
    type: 'SET_PLAY',
    playing
  };
}

export function setTick(tick) {
  return {
    type: 'SET_TICK',
    tick
  };
}

export function setBpm(bpm) {
  return {
    type: 'SET_BPM',
    bpm
  };
}

export function reinitStats(stats) {
  return {
    type: 'REINIT_STATS',
    stats
  };
}
