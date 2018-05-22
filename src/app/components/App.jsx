import React, { Component } from 'react';
import PropTypes from 'prop-types';

class App extends Component {

  render() {
    const { children } = this.props;
    return (
      <div className="container">
        {children}
      </div>
    );
  }

}

App.propTypes = {
  children: PropTypes.object,
};

export default App;
