import React, { Component } from 'react';
import { Howl, Howler } from 'howler';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sample from "../sample";
import Bar from "../bar";
import Pointer from "../pointer";
import {setTick, setBpm, setPlay, deleteBars} from "../../actions/stats";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/icons/Menu"
import Delete from "@material-ui/icons/Delete"



class SynthReactor extends Component {

  state = {
    playing: false,
    interval: null,
    loop: true,
    metronome: {
      click: {
        default: null,
        up: null
      },
      interval: null,
      mute: false
    },
    sampleNodes: [
      <Sample key={0} name="Kick" src="/static/samples/kicks/kick_1.wav" />,
      <Sample key={1} name="Snare" src="/static/samples/snares/snare_4.wav" />,
      <Sample key={2} name="Hi-hat"src="/static/samples/hihats/hihat_008a.wav" />
    ],
    barNodes: [],
    barInfo: null,
    tick: {
      bar: 0,
      beat: 0,
      note: 0
    }
  };

  componentDidMount() {
    this.init()
  }

  init = () => {
    const barNodes = [{}];
    this.setState({barNodes});
  };

  togglePlay = _ => {
    const { playing } = this.state;
    this.setState({playing: !playing}, () => {
      const { dispatch } = this.props;
      dispatch(setPlay(this.state.playing));
      this.play();
    })
  };

  play = () => {
    const { stats: { bpm, bars }, dispatch } = this.props;
    const { playing, interval, metronome, tick } = this.state;
    if(playing) {
      const metr = new Howl({src: ["/static/samples/ticks/click_1.wav"]});
      const metrUp = new Howl({src: ["/static/samples/ticks/click_1_up.wav"]});
      this.playNote(0, 0);
      if(!metronome.mute) metrUp.play();
      this.setState({
        interval: setInterval(() => {
          const { tick: { bar, beat, note }, metronome: { mute }  } = this.state;
          let newNote = note === 15 ? 0 : note + 1;
          let newBeat = beat;
          let newBar = bar;
          if(newNote % 4 === 0) {
            newBeat = beat === 3 ? 0: beat + 1;
            if(newBeat % 4 === 0) {
              newBar = bar === bars.length - 1 ? 0 : bar + 1;
              if(!mute) metrUp.play();
            } else {
              if(!mute) metr.play();
            }
          }
          this.playNote(newBar, newNote);
          this.setState({tick: {note: newNote, beat: newBeat, bar: newBar}});
        }, 15 / bpm * 1000),
        metronome: {
          ...metronome,
          click: {
            default: metr,
            up: metrUp
          },
        }
      });
    } else {
      clearInterval(interval);
      clearInterval(metronome.interval);
      this.setState({
        interval: null,
        tick: {
          bar: 0,
          beat: 0,
          note: 0
        }
      }, () => {
        dispatch(setTick(tick))
      });
    }
  };


  playNote = (bar, note) => {
    const { bars, samples } = this.props.stats;
    for(let i = 0; i < bars.length; i++) {
      bars[bar].map((sample, idx) => {
        sample.notes.includes(note) ? samples[idx].audio.play() : null;
      });
    }
  };

  muteMetronome = e => {
    this.setState({metronome: {...this.state.metronome, mute: !this.state.metronome.mute}})
  };

  setBpm = e => {
    const { dispatch } = this.props;
    const value = +(e.target.value);
    if(value <= 250) {
      dispatch(setBpm(value));
    }
  };

  addBar = () => {
    const { bars } = this.props.stats;
    let { barNodes } = this.state;
    barNodes.push(<Bar key={bars.length} index={bars.length} onClick={this.onClickAction}/>);
    this.setState({barNodes})
  };

  deleteBar = barID => {
    let { barNodes } = this.state;
    barNodes.splice(barID, 1);
    // const newBarNodes = this.reinitBars(barID, barNodes);

    this.setState({barNodes, barInfo: null})
  };

  reinitBars = (deletedBarID, barNodes) => {
    const { stats: { bars } } = this.props;
    let newBarNodes = [];
    barNodes.map((bar, idx) => {
      const newOne = idx >= deletedBarID;
      newBarNodes.push(<Bar key={idx} index={idx} onClick={this.onClickAction} notes={bars[newOne ? idx + 1 : idx]} />);
    });
    return newBarNodes
  };

  onClickAction = object => {
    this.setState(object)
  };

  renderBars = () => {
    const { barNodes } = this.state;
    return (
      <div>
        {barNodes.map((bar, idx) => {
          return (<Bar key={idx} index={idx} onClick={this.onClickAction} />)
        })}
      </div>
    )
  };

  render() {
    let { bpm } = this.props.stats;
    const { tick, tick: { bar, beat, note }, playing, sampleNodes, barNodes, metronome: { mute }, barInfo } = this.state;
    const playingText = playing ? "stop" : "play";

    return (
      <div>
        <div className="controls">
          <div className="controls-">
            <span>Bar: {bar +1}</span>
            <span>Beat: {beat + 1}</span>
            <span>Note: {note + 1}</span>
          </div>
          <div className="controls-play">
            <div>
              <div>
                Metronome <span>{bpm}</span>
              </div>
              <input type="range" min={40} max={250} value={bpm} onChange={this.setBpm} />
              <div onClick={this.muteMetronome}>Turn {mute ? "ON" : "OFF"}</div>
            </div>
            <span onClick={this.togglePlay}>{playingText}</span>
          </div>
          <div className="controls-bars">
            <Button variant="fab" mini color="secondary" aria-label="add" className="button" onClick={this.addBar} title="Add bar">
              <Menu />
            </Button>
            {barInfo !== null ?
              <div className="controls-single-bar">
                <Button variant="fab" mini color="secondary" aria-label="add" className="button" onClick={_ => this.deleteBar(barInfo)}>
                  <Delete />
                </Button>
              </div> : null
            }
          </div>
        </div>
        <div className="trackline">
          <div>
            <div>{sampleNodes}</div>
          </div>
          <div className="bars">
            <div className="bars-container">
              {this.renderBars()}
            </div>
            {/*<Pointer position={tick} />*/}
          </div>

        </div>


        {/*<div>*/}
          {/*<AppBar>*/}
            {/*<Toolbar>*/}
              {/*<Typography variant="title" color="inherit" noWrap>*/}
                {/*Responsive drawer*/}
              {/*</Typography>*/}
            {/*</Toolbar>*/}
          {/*</AppBar>*/}
          {/*<Drawer*/}
            {/*variant="permanent"*/}
            {/*anchor='left'*/}
            {/*open*/}
            {/*ModalProps={{keepMounted: true,}}*/}
          {/*>*/}
            {/*<div className="ist">*/}
              {/*<List>*/}
                {/*<Typography variant="title" color="inherit" noWrap>*/}
                  {/*Responsive drawer*/}
                {/*</Typography>*/}
                {/*<Typography variant="title" color="inherit" noWrap>*/}
                  {/*Responsive drawer*/}
                {/*</Typography>*/}
              {/*</List>*/}
            {/*</div>*/}
          {/*</Drawer>*/}
          {/*<main>*/}
            {/*<div/>*/}
            {/*<Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>*/}
          {/*</main>*/}
        {/*</div>*/}
      </div>
    )
  }

}

SynthReactor.propTypes = {

};

export default connect(state => state)(SynthReactor);