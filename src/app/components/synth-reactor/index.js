import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sample from "../sample";
import Bar from "../bar";
import {setPlay} from "../../actions/stats";

class SynthReactor extends Component {

  state = {
    playing: false,
    interval: null,
    sampleNodes: [<Sample key={1} src="/static/samples/kick.wav"/>],
  };

  togglePlay = e => {
    const { playing } = this.state;
    this.setState({playing: !playing}, () => {
      const { dispatch } = this.props;
      dispatch(setPlay(this.state.playing));
      this.play();
    })
  };

  play = () => {
    const { bpm } = this.props.stats;
    const { playing, interval } = this.state;
    if(playing) {
      this.setState({
        interval: setInterval(() => {
          console.log(1)
        }, 15 / bpm)
      })
    } else {
      clearInterval(interval);
      this.setState({interval: null});
    }
  };

  render() {
    const { playing, sampleNodes } = this.state;
    const playingText = playing ? "stop" : "play";
    return (
      <div>
        <div className="controls">
          <div className="controls-play" onClick={this.togglePlay}>
            {playingText}
          </div>
        </div>
        <div className="trackline">
          {sampleNodes}
          <Bar />
        </div>
      </div>
    )
  }

}

SynthReactor.propTypes = {

};

export default connect(state => state)(SynthReactor);