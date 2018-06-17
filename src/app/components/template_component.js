import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {palette} from "./common/helpers";


class Sample extends Component {

  state = {

  };

  render() {
    return (
      <div></div>
    );
  }

}

Sample.propTypes = {

};

export default connect(state => state)(Sample)