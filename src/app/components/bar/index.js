import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {addBar, switchNoteInBar} from "../../actions/stats";
import {NOTES_AMOUNT} from "../common/helpers";

class Bar extends Component {

  state = {
    index: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { stats: { bars, samples }, dispatch, index, notes } = nextProps;
    if(!bars[index] || bars[index].length !== samples.length) {
      console.log('Initiating bar: ' + index);
      let initNotes = notes ? notes : [];
      if(initNotes.length <= 0) {
        samples.map((sample) => {
          initNotes.push({id: sample.id, notes: []});
        });
      }
      dispatch(addBar(index, initNotes));
    }
    return {index}
  }

  // componentWillUnmount() {
  //   const { dispatch, index } = this.props;
  //   dispatch(deleteBar(index));
  //   console.log(this.props.stats.bars)
  // }

  setActiveNote = (_, noteIndex, sampleIndex) => {
    const { dispatch, index } = this.props;
    dispatch(switchNoteInBar(index, noteIndex, sampleIndex));
  };

  activateBarInfo = barID => {
    this.props.onClick({barInfo: barID});
  };


  renderNotes = (sampleNotes, sampleIndex) => {
    let domNotes = [];
    for(let i = 0; i < NOTES_AMOUNT; i++) {
      const note = sampleNotes.includes(i) ? 1 : 0;
      domNotes.push(
        <div key={i}
             className={`sample-notes-note ${note === 1 ? "active" : ""}`}
             onClick={_ => this.setActiveNote(_, i, sampleIndex)}>
          {sampleIndex === 0 ? <span className="sample-notes-note-number" onClick={this.setPosition}>{i + 1}</span> : null}
        </div>
      );
    }
    return domNotes
  };

  renderSamples = () => {
    const { stats: { bars, samples }, index } = this.props;
    return (
      <div>
        {bars[index].map((sample, idx) => {
            return (
              <div key={idx} className="sample">
                <span className="sample-name">{index === 0 ? samples[idx].name : null}</span>
                <div className="sample-notes">
                  {this.renderNotes(sample.notes, idx)}
                </div>
              </div>
            )
          })
        }
      </div>
    );
  };

  render() {
    const { index } = this.props;
    return (
      <div className="bar" id={`bar-${index + 1}`}>
        <div className="bar-info">
          <span className="bar-info-name" onClick={e => this.activateBarInfo(index)}>Bar {index + 1}</span>
        </div>
        {this.renderSamples()}
      </div>
    );
  }

}

Bar.propTypes = {

};

export default connect(state => state)(Bar)