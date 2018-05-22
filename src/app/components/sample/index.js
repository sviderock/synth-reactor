import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { genId } from "../common/helpers";
import { addSample } from "../../actions/stats";

class Sample extends Component {

  state = {
    id: null,
    audio: null,
    group: ""
  };

  componentWillMount() {
    const { src } = this.props;
    const id = genId("sample");
    const audio = new Audio(src);
    this.setState({id, audio}, () => {
      const { dispatch } = this.props;
      dispatch(addSample(this.state))
    })
  }

  render() {
    return null
  }

}

Sample.propTypes = {
  src: PropTypes.string.isRequired
};

export default connect(state => state)(Sample)