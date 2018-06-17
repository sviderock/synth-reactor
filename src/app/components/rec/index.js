import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Recorder from 'recorderjs';

class Rec extends Component {

  state = {
    context: null,
    recorder: null,
    link: null
  };

  componentDidUpdate(prevProps){
    if(prevProps.rec !== this.props.rec) {
      if(this.props.rec) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    }
  }


  componentDidMount() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    const context = new AudioContext;
    this.setState({context});

    console.log('Audio context set up.');
    console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

    navigator.getUserMedia({audio: true}, this.startUserMedia, e => console.log('No live audio input: ' + e));
  }

  startUserMedia = stream => {
    const { context } = this.state;
    const input = context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    const recorder = new Recorder(input, {encoderPath: "/node_modules/recorderjs/recorderWorker.js", bufferLen: 16384});
    console.log('Recorder initialised.');
    this.setState({recorder}, () => console.log(this.state))
  };

  startRecording = () => {
    const { recorder } = this.state;
    recorder && recorder.record();
    console.log('Recording...')
  };

  stopRecording = () => {
    const { recorder } = this.state;
    recorder && recorder.stop();
    console.log('Stopped recording.');
    this.createDownloadLink();
    recorder.clear();
  };

  createDownloadLink = () => {
    const { recorder } = this.state;
    let link = '';
    recorder.exportWAV(blob => {
      link = URL.createObjectURL(blob);
      this.setState({link}, () => this.props.onSave(this.state.link));
    });
  };

  render() {
    return null
  }

}

Rec.propTypes = {
  rec: PropTypes.bool,
  onSave: PropTypes.func
};

export default connect(state => state)(Rec)