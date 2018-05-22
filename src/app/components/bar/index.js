import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class Bar extends Component {

  state = {
    samples: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { stats } = nextProps;
    if(stats.samples && stats.samples.length !== prevState.samples.length) {
      const { samples } = stats;
      let newSamples = [];
      Object.values(samples).map(sample => {
        newSamples.push({id: sample.id, notes: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
      });
      return {
        samples: newSamples
      }
    }
    return null
  }

  setActiveNote = (e, note) => {
    const { samples } = this.state;
    const { sampleIdx, noteIdx, noteValue } = note;
    samples[sampleIdx].notes[noteIdx] = noteValue;
    this.setState({samples}, () => console.log(this.state))
  };

  render() {
    const { samples } = this.state;
    return (
      <div className="bar">
        {samples.map((sample, idx) => {
          return (
            <div key={idx} className="sample-notes">
              {sample.notes.map((note, noteIndex) => {
                const noteToSet = {
                  sampleIdx: idx,
                  noteIdx: noteIndex,
                  noteValue: note === 0 ? 1 : 0
                };
                return (
                  <div key={noteIndex}
                       className={`sample-notes-note ${note === 1 ? "active" : ""}`}
                       onClick={e => this.setActiveNote(e, noteToSet)}
                  >

                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    );
  }

}

Bar.propTypes = {

};

export default connect(state => state)(Bar)