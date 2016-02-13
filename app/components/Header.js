import React, { Component, PropTypes } from 'react';
import Sticky from 'react-sticky';

class Header extends Component {
  render() {
    return (
      <Sticky>
        <span>This is header.</span>
      </Sticky>
    );
  }
}

export default Header;
