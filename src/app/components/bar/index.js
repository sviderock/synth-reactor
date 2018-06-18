import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {addBar, switchNoteInBar} from "../../actions/stats";
import {colors, NOTES_AMOUNT, palette} from "../common/helpers";
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import classNames from "classnames";


const styles = theme => ({
  note: {
    minHeight: '3rem',
    minWidth: '2rem',
    margin: '0 .1rem',
    backgroundColor: '#A0C1D1'
  },
  barInfo: {
    color: theme.palette.primary.main,
    top: '-.8rem',
    height: '110%'
  },
  barInfoActive: {
    backgroundColor: '#ecc9b9'
  },
  barSampleNotes: {
    padding: '1rem 0',
    display: 'flex'
  }
});

class Bar extends Component {

  state = {

  };

  static getDerivedStateFromProps(nextProps) {
    const { stats: { bars, samples }, dispatch, index, notes } = nextProps;

    if(!bars[index]) {
      let initNotes = notes ? notes : [];
      if(initNotes.length <= 0) {
        samples.map((sample) => {
          initNotes.push({id: sample.id, notes: []});
        });
      }
      dispatch(addBar(index, initNotes));
    }

    if(bars[index].length !== samples.length) {
      const sampleIDS = bars[index].map(sample => sample.id);
      samples.map(sample => {
        if(!sampleIDS.includes(sample.id)) {
          bars[index].push({id: sample.id, notes: []});
        }
      });
      dispatch(addBar(index, bars[index]));
    }

    return {index}
  }

  setActiveNote = (_, noteIndex, sampleIndex) => {
    const { dispatch, index } = this.props;
    dispatch(switchNoteInBar(index, noteIndex, sampleIndex));
  };

  activateBarInfo = barID => {
    this.props.onClick({barInfo: barID});
  };

  renderNotes = (sampleNotes, sampleIndex, color) => {
    const { classes } = this.props;
    let domNotes = [];
    for(let i = 0; i < NOTES_AMOUNT; i++) {
      const note = sampleNotes.includes(i) ? 1 : 0;
      domNotes.push(
        <Button key={i}
                variant={note === 1 ? 'contained' : 'outlined'}
                size="small"
                component="div"
                style={{backgroundColor: note === 1 ? color.bg : '#A0C1D155'}}
                className={classNames("bar-sample-notes-note", classes.note)}
                onClick={_ => this.setActiveNote(_, i, sampleIndex)} />
      );
    }
    return domNotes
  };

  renderSamples = () => {
    const { stats: { bars, samples }, index, classes } = this.props;
    return (
      <div>
        {bars[index].map((sample, idx) => {
          if(!samples.find(i => i.id === sample.id).deleted) {
            const colorIDX = idx >= colors.length ? (idx - colors.length) : idx;
            return (
              <div key={idx} className="bar-sample">
                <div className={classNames("bar-sample-notes", classes.barSampleNotes)}>
                  {this.renderNotes(sample.notes, idx, colors[colorIDX])}
                </div>
              </div>
            )
          }
          })
        }
      </div>
    );
  };

  render() {
    const { index, classes, active, deleted } = this.props;
    console.log(this.props.stats.bars)
    return (
      <div className="bar" id={`bar-${index + 1}`}>
        <div className={classNames("bar-info", classes.barInfo, active ? classes.barInfoActive : null)}>
          <span className="bar-info-name" onClick={_ => this.activateBarInfo(index)}>Bar {index + 1}</span>
        </div>
        {this.renderSamples()}
      </div>
    );
  }

}

Bar.propTypes = {

};

export default connect(state => state)(withStyles(styles)(Bar))