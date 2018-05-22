import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Sample extends Component {

  state = {

  };

  render() {
    return (
      <div />
    );
  }

}

Sample.propTypes = {

};

export default connect(state => state)(Sample)