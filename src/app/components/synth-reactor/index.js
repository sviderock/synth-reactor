import React, { Component } from 'react';
import { Howl, Howler } from 'howler';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sample from "../sample";
import Bar from "../bar";
import ModalWrapped from "../modal";
import SamplesModalContent from "../modal/content/sample-modal";
import {setTick, setBpm, setPlay, deleteSample, reinitStats} from "../../actions/stats";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/icons/Menu";
import Delete from "@material-ui/icons/Delete";
import MusicNote from "@material-ui/icons/MusicNote";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import classNames from "classnames";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Stop from "@material-ui/icons/Stop";
import { MetronomeIcon, RecordIcon } from '../common/icons';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {colors, palette} from "../common/helpers";
import Rec from '../rec';
import Save from "@material-ui/icons/Save";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Loop from "@material-ui/icons/Loop";
import Chip from "@material-ui/core/Chip";

const theme = createMuiTheme({
  palette: {
    primary: {
      blue: palette.blue,
      main: palette.blue,
      black: palette.black,
      green: palette.green,
      white: palette.white,
      contrastText: palette.white,
      peach: palette.peach
    },
    secondary: {
      main: palette.peach
    }
  },
});


const drawerWidth = 300;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: palette.black,
  },
  peachButton: {
    backgroundColor: palette.peach,
    color: palette.white
  },
  peachButtonActive: {
    backgroundColor: palette.peachDark,
    color: palette.white
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: palette.black
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: '#DADFF7',
    padding: '5rem 1rem',
    overflow: 'auto'
  },
  trackline: {
    width: 'max-content',
    marginTop: '1.2rem'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    color: '#DADFF7',
    margin: 0
  },
  controllsSection: {

  },
  controllsTick: {
    backgroundColor: palette.peach,
    color: palette.white,
    padding: '0.3rem 0 .8rem'
  },
  samples: {

  },
  barNumber: {
    minWidth: '1.5rem',
    minHeight: '1.5rem',
    padding: 0,
    borderRadius: '50%',
    fontSize: '0.8rem',
    margin: '0 .35rem .5rem',
  },
  controlsBars: {
    height: '4rem',
    display: 'flex',
    alignItems: 'center'
  }
});


class SynthReactor extends Component {

  state = {
    playing: false,
    interval: null,
    loop: true,
    metronome: {
      click: {
        down: null,
        up: null
      },
      mute: false
    },
    sampleNodes: [],
    barNodes: [],
    barInfo: null,
    tick: {
      bar: 0,
      beat: 0,
      note: 0
    },
    modalOpened: false,
    recording: false,
    lastRecSrc: null,
    dialogOpened: false,
    sampleToDeleteID: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps.stats.samples);
    // if(nextProps.stats.samples.length !== prevState.sampleNodes.length) {
    //
    // }
    return prevState
  }

  componentDidMount() {
    this.init();
    // const stats = JSON.parse(localStorage.getItem('stats'));
    // if(stats && Object.keys(stats).length > 0) {
    //   const { dispatch } = this.props;
    //   console.log(stats)
    //   dispatch(reinitStats(stats))
    // }
    window.addEventListener("beforeunload", this.onUnload);
  }

  init = () => {
    const barNodes = [{}];
    this.initMetronome();
    this.initSamples();
    this.setState({barNodes});
  };

  togglePlay = () => {
    const { playing } = this.state;
    if(playing) {
      this.stop();
    } else {
      this.setState({playing: true}, () => {
        const { dispatch } = this.props;
        dispatch(setPlay(this.state.playing));
        this.play();
      })
    }
  };

  onUnload = e => {
    const { stats } = this.props;
    // localStorage.setItem('stats', JSON.stringify(stats));
    // return "Are you sure to leave this page?";
  };

  play = () => {
    const { stats: { bpm }, dispatch } = this.props;
    const { playing, interval, tick, metronome: { mute, click: { up } } } = this.state;
    if(playing) {
      if(!mute) up.play();
      this.playNote(tick.bar, tick.note);
      this.setState({interval: setInterval(this.setPlayInterval, 15 / bpm * 1000)});
    } else {
      clearInterval(interval);
      this.setState({interval: null, tick: {bar: 0, beat: 0, note: 0}}, () => dispatch(setTick(tick)));
    }
  };

  stop = () => {
    const { dispatch } = this.props;
    const { interval } = this.state;
    clearInterval(interval);
    this.setState({interval: null, playing: false, recording: false, tick: {bar: 0, beat: 0, note: 0}}, () => {
      dispatch(setTick(this.state.tick));
      dispatch(setPlay(this.state.playing))
    })
  };

  initMetronome = () => {
    const { metronome } = this.state;
    const down = new Howl({src: ["/static/samples/ticks/click_1.wav"]});
    const up = new Howl({src: ["/static/samples/ticks/click_1_up.wav"]});
    this.setState({metronome: {...metronome, click: {down, up}}})
  };

  initSamples = samples => {
    // const smpls = samples || this.props.stats.samples;
    let sampleNodes = [
      <Sample key={0} color={colors[0]} onDelete={this.deleteSample} name="Kick" src="/static/samples/kicks/kick_1.wav" />,
      <Sample key={1} color={colors[1]} onDelete={this.deleteSample} name="Snare" src="/static/samples/snares/snare_4.wav" />,
      <Sample key={2} color={colors[2]} onDelete={this.deleteSample} name="Hi-hat" src="/static/samples/hihats/hihat_008a.wav" />
    ];
    // smpls.map((sample, idx) => {
    //   sampleNodes.push(<Sample key={sample.id} id={sample.id} color={colors[idx]} onDelete={this.deleteSample} name={sample.name} src={sample.src} />);
    // });
    this.setState({sampleNodes}, () => console.log(this.props.stats.samples))
  };

  setPlayInterval = () => {
    const { bars } = this.props.stats;
    const { tick: { bar, beat, note }, metronome: { mute, click: { up, down } }, loop } = this.state;
    let newNote = note === 15 ? 0 : note + 1;
    let newBeat = beat;
    let newBar = bar;
    if(newNote % 4 === 0) {
      newBeat = beat === 3 ? 0: beat + 1;
      if(newBeat % 4 === 0) {
        if(bar === bars.length - 1) {
          newBar = 0;
          if(!loop) this.stop();
        } else {
          newBar = bar + 1;
        }
        // newBar = bar === bars.length - 1 ? 0 : bar + 1;
        if(!mute) up.play();
      } else {
        if(!mute) down.play();
      }
    }
    this.playNote(newBar, newNote);
    this.setState({tick: {note: newNote, beat: newBeat, bar: newBar}});
  };

  playNote = (bar, note) => {
    const { bars, samples } = this.props.stats;
    bars[bar].map((sample, idx) => {
      sample.notes.includes(note) ? (!samples[idx].mute ? samples[idx].audio.play() : false) : null;
    });
  };

  toggleMetronome = e => {
    const { metronome } = this.state;
    this.setState({metronome: {...metronome, mute: !metronome.mute}})
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


  toggleModal = () => {
    const { modalOpened } = this.state;
    this.setState({modalOpened: !modalOpened})
  };

  addSample = sample => {
    let { sampleNodes, modalOpened } = this.state;
    sampleNodes.push(sample);
    this.setState({sampleNodes, modalOpened: !modalOpened})
  };

  setTick = tick => {
    this.setState({tick});
  };

  tickIsActive = (cBar, cNote) => {
    const { bar, note } = this.state.tick;
    return bar === cBar && cNote === note;
  };

  toggleRecording = e => {
    const { recording } = this.state;
    if(recording) {
      this.setState({recording: false}, () => this.stop());
    } else {
      this.setState({recording: true}, () => this.togglePlay());
    }
  };

  getLastRecordedSrc = link => {
    this.setState({lastRecSrc: link})
  };

  deleteSample = idx => {
    let { samples } = this.props.stats;
    // console.log(samples)
    // let { sampleNodes } = this.state;
    // sampleNodes.splice(idx, 1);
    // samples.splice(idx, 1);
    // this.initSamples(samples);
    // this.setState({dialogOpened: false, sampleNodes})
  };

  toggleLoop = () => {
    const { loop } = this.state;
    this.setState({loop: !loop})
  };

  renderBars = () => {
    const { barNodes, barInfo } = this.state;
    return (
      <div className="bars-container">
        {barNodes.map((bar, idx) => {
          return (<Bar key={idx} index={idx} active={barInfo === idx} onClick={this.onClickAction} />)
        })}
      </div>
    )
  };

  renderNotesNumbers = () => {
    const { stats: { bars }, classes } = this.props;
    const numbers = [];
    bars.map((bar, idx) => {
      numbers[idx] = [];
      for(let i = 0; i < 16; i++) {
        const newTick = {bar: idx, beat: Math.floor(i / 4), note: i};
        numbers[idx].push(
          <Button key={bar + '-' + i}
                  variant="outlined"
                  component="span"
                  onClick={_ => this.setTick(newTick)}
                  className={classNames("bars-number-bar", classes.barNumber, this.tickIsActive(idx, i) ? 'active' : '')}>
            {i + 1}
          </Button>
        )
      }
    });

    return (
      <div className="bars-numbers">
        {numbers}
      </div>
    )
  };

  render() {
    let { stats: { bpm }, classes } = this.props;
    const {
      tick: { bar, beat, note },
      playing,
      sampleNodes,
      metronome: { mute },
      barInfo,
      modalOpened,
      recording,
      lastRecSrc,
      dialogOpened,
      loop,
      sampleToDeleteID} = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar position="absolute"
                    className={classNames(classes.appBar, "app-bar")}>
              <Toolbar>
                <div className="controls">
                  <div className="controls-metronome">
                    <span className="controls-label">Metronome</span>
                    <Button className={classNames(mute ? classes.peachButton : classes.peachButtonActive)} variant="fab" mini color="secondary" onClick={this.toggleMetronome}>
                      <MetronomeIcon />
                    </Button>
                    <TextField
                      value={bpm}
                      onChange={this.setBpm}
                      type="number"
                      className={classNames(classes.textField, 'metronome-input')}
                      InputProps={{className: classes.textField}}
                      inputProps={{min: 40, max: 250}}
                      margin="normal"
                    />
                  </div>
                  <div className="controls-play">
                    <span className="controls-label">Play controls</span>
                    <Button className={classNames(playing ? classes.peachButtonActive : classes.peachButton)} variant="fab" mini color="secondary" onClick={this.togglePlay}>
                      {playing ? <Stop/> : <PlayArrow />}
                    </Button>

                    <Button className={classNames(loop ? classes.peachButtonActive : classes.peachButton)} variant="fab" mini color="secondary" onClick={this.toggleLoop}>
                      <Loop />
                    </Button>
                  </div>
                  <div className="controls-bars">
                    <span className="controls-label">Bars controls</span>
                    <Button className={classNames(classes.peachButton)} variant="fab" mini color="secondary" onClick={this.addBar}>
                      <Menu />
                    </Button>
                  </div>

                  <div className="controls-samples">
                    <span className="controls-label">Samples controls</span>
                    <Button className={classNames(classes.peachButton)} variant="fab" mini color="secondary" onClick={this.toggleModal}>
                      <MusicNote />
                    </Button>
                  </div>

                  <div className="controls-record">
                    <span className="controls-label">Recording</span>
                    <Button className={classNames(classes.peachButton)} variant="fab" mini color="secondary" onClick={this.toggleRecording}>
                      <RecordIcon active={recording ? 1 : 0} />
                    </Button>
                    {
                      lastRecSrc ?
                        <Button className={classNames(classes.peachButton)} download="rec.wav" href={lastRecSrc} component="a" variant="fab" mini>
                          <Save />
                        </Button>: null
                    }
                  </div>
                </div>

                <Typography align="right" variant="title" color="inherit" noWrap>
                  Synth Reactor
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{paper: classes.drawerPaper}}
              anchor="left">
              <div className={classNames("controls-tick", classes.controllsTick)}>
                <div className="controls-tick-item">
                  <span>BAR</span>
                  <Chip label={bar + 1} className={classes.chip} />
                </div>
                <div className="controls-tick-item">
                  <span>BEAT</span>
                  <Chip label={beat + 1} className={classes.chip} />
                </div>
                <div className="controls-tick-item">
                  <span>NOTE</span>
                  <Chip label={note + 1} className={classes.chip} />
                </div>
              </div>
              <Divider />
              <div className={classNames("controls-bar", classes.controlsBars)}>
                {barInfo !== null ?
                  <div className="controls-bar-single">
                    <Button variant="fab" mini color="secondary" aria-label="add" className="button" onClick={_ => this.deleteBar(barInfo)}>
                      <Delete />
                    </Button>
                  </div> : null
                }
              </div>
              <div className={classNames("samples", classes.samples)}>
                <div className="samples-container">
                  {sampleNodes}
                </div>
              </div>
            </Drawer>
            <div className={classes.content}>



              <div className={classNames(classes.trackline, 'trackline')}>

                <div className="bars">
                  {this.renderNotesNumbers()}
                  {this.renderBars()}
                </div>

              </div>

            </div>
          </div>


          <ModalWrapped opened={modalOpened} onClose={this.toggleModal}>
            <SamplesModalContent onSampleAdd={this.addSample}/>
          </ModalWrapped>

          <Rec rec={recording} onSave={this.getLastRecordedSrc} />
        </div>


        <div>
          <Dialog
            open={dialogOpened}
            onClose={() => this.onClickAction({dialogOpened: false})}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You really want to delete sample {sampleToDeleteID}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={e => this.onClickAction({dialogOpened: false})} color="primary">
                Cancel
              </Button>
              <Button onClick={e => this.deleteSample(sampleToDeleteID)} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }

}

SynthReactor.propTypes = {

};

export default connect(state => state)(withStyles(styles)(SynthReactor));