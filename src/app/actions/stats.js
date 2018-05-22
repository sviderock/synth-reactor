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

export function addBar(bar) {
  return {
    type: 'ADD_BAR',
    bar
  };
}

export function setPlay(playing) {
  return {
    type: 'SET_PLAY',
    playing
  };
}