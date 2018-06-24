import React, { Component } from 'react';
import { Howl, Howler } from 'howler';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Folder from "@material-ui/icons/Folder";
import MusicNote from "@material-ui/icons/MusicNote";
import IconButton from "@material-ui/core/IconButton";
import Check from "@material-ui/icons/Check";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Sample from "../../../sample";
import {colors} from "../../../common/helpers";

class SamplesModalContent extends Component {

  state = {
    samplesList: null,
    openedLists: []
  };

  componentDidMount() {
    fetch('/getSamples').then(res => {
      return res.json()
    }).then(data => this.setState({samples: data.fileslist}));
  }

  handleOpen = idx => {
    let { openedLists } = this.state;
    openedLists.includes(idx) ? openedLists.splice(openedLists.indexOf(idx), 1) : openedLists.push(idx);
    this.setState({openedLists});
  };

  playSound = (dir, sound) => {
    const path = '/static/samples/' + dir + '/' + sound;
    const sample = new Howl({src: [path]});
    sample.play();
  };

  selectSound = (dir, sound) => {
    const { samples } = this.props.stats;
    const path = '/static/samples/' + dir + '/' + sound;
    const colorIDX = samples.length >= colors.length ? (samples.length - colors.length) : samples.length;
    const sample = <Sample color={colors[colorIDX]} key={samples.length} name={sound} src={path} />;
    this.props.onSampleAdd(sample);
  };

  render() {
    const { samples, openedLists } = this.state;
    return (
      ![null, undefined].includes(samples) ?
      <div>
        <List subheader={<ListSubheader className={"modal-header"} component="div">Select sample</ListSubheader>}>
          {
            samples.map((itm, idx) => {
              const dir = Object.keys(itm)[0];
              const sounds = itm[dir];
              return (
                <div key={idx}>
                  <ListItem button onClick={_ => this.handleOpen(idx)}>
                    <ListItemIcon>
                      <Folder />
                    </ListItemIcon>
                    <ListItemText inset primary={dir} />
                    {openedLists.includes(idx) ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openedLists.includes(idx)} timeout="auto" unmountOnExit>
                    <List component="div">
                      {
                        sounds.map(sound => {
                          return (
                            <ListItem>
                              <IconButton onClick={() => {this.playSound(dir, sound)}} >
                                <MusicNote />
                              </IconButton>
                              <ListItemText inset primary={sound} />
                              <ListItemSecondaryAction onClick={() => this.selectSound(dir, sound)}>
                                <IconButton aria-label="Comments">
                                  <Check />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )
                        })
                      }
                    </List>
                  </Collapse>
                </div>
              )
            })
          }
        </List>
      </div> : null
    );
  }

}

SamplesModalContent.propTypes = {
  onSampleAdd: PropTypes.object
};

export default connect(state => state)(SamplesModalContent)