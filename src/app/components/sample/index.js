import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {genId, palette} from "../common/helpers";
import {addSample, deleteSample, muteSample} from "../../actions/stats";
import { Howl } from "howler";
import ListItem from "@material-ui/core//ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import MusicNote from "@material-ui/icons/MusicNote"
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Menu from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";



const styles = theme => ({
  peachButton: {
    backgroundColor: palette.peach,
    color: palette.white
  },
  peachButtonActive: {
    backgroundColor: palette.peachDark,
    color: palette.white
  }
});

class Sample extends Component {

  state = {
    id: "",
    audio: null,
    group: "",
    name: "",
    open: false,
    mute: false,
    color: {
      bg: palette.peach,
      text: palette.white
    }
  };

  componentWillMount() {
    const { src, name, color } = this.props;
    const { mute } = this.state;
    const id = genId('sample');
    const audio = new Howl({src: [src]});
    this.setState({id, audio, name, mute, color}, () => {
      const { dispatch } = this.props;
      dispatch(addSample(this.state))
    })
  }

  // componentWillUnmount() {
  //   const { dispatch, id } = this.props;
  //   dispatch(deleteSample(id));
  // }

  toggleOpen = e => {
    const { open } = this.state;
    this.setState({open: !open})
  };

  deleteSample = id => {
    const { samples } = this.props.stats;
    const idx = samples.indexOf(samples.find(sample => sample.id === id));
    this.props.onDelete(idx)
  };

  muteSample = e => {
    const { dispatch } = this.props;
    const { mute, id } = this.state;
    this.setState({mute: !mute}, () => dispatch(muteSample(id, this.state.mute)))
  }

  render() {
    const { color } = this.props;
    const { id, name, open, mute } = this.state;
    return (
      <div>
        <div className="sample" id={id} style={{backgroundColor: color.bg}}>
          <ListItem>
            <Avatar>
              <MusicNote />
            </Avatar>
            <ListItemText style={{color: color.text}} primary={name} secondary="sample" />
            <ListItemSecondaryAction onClick={this.toggleOpen}>
              <IconButton>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              </ListItemSecondaryAction>
            <Divider />
          </ListItem>
        </div>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div">
            <Button variant="fab" mini color="secondary" onClick={this.muteSample}>
              {mute ? <VolumeOff />: <VolumeUp />}
            </Button>
            {/*<Button variant="fab" mini color="secondary">*/}
              {/*<Delete onClick={e => this.deleteSample(id)} />*/}
            {/*</Button>*/}
          </List>
        </Collapse>
      </div>

    )
  }

}

Sample.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string,
  color: PropTypes.object
};

export default connect(state => state)(Sample)