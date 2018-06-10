import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {NOTES_AMOUNT} from "../common/helpers";

class Pointer extends Component {

  state = {
    left: 0,
    step: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { position: { bar, note }, stats: { bars } } = nextProps;
    let left = 0;
    const step = prevState.step;
    if(prevState.step) {
      left = (prevState.left === 100 - step || !nextProps.stats.playing) ? 0 : prevState.left + step;
    }
    return {left}
  }

  componentDidMount() {
    const { bars } = this.props.stats;
    let { step } = this.state;
    step = !step && 100 / (NOTES_AMOUNT * bars.length);
    this.setState({step})
  }

  render() {
    const { left } = this.state;
    return (
      <div className="pointer" style={{left: left + '%'}}/>
    );
  }

}

Pointer.propTypes = {

};

export default connect(state => state)(Pointer)