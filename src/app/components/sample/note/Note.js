import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Note extends Component {

  state = {
    index: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {

  }

  render() {
    return (
      <div className="note" />
    )
  }

}

Sample.propTypes = {
  src: PropTypes.string.isRequired
};

export default Sample