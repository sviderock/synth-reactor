import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { genId } from "../common/helpers";
import { addSample } from "../../actions/stats";
import { Howl } from "howler";

class Sample extends Component {

  state = {
    id: null,
    audio: null,
    group: "",
    name: ""
  };

  componentWillMount() {
    const { src, name } = this.props;
    const id = genId("sample");
    const audio = new Howl({src: [src]});
    this.setState({id, audio, name}, () => {
      const { dispatch } = this.props;
      dispatch(addSample(this.state))
    })
  }

  render() {
    return (
      <div className="sample">

      </div>
    )
  }

}

Sample.propTypes = {
  src: PropTypes.string.isRequired
};

export default connect(state => state)(Sample)