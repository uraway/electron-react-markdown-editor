import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/editor">to Editor</Link>
        </div>
      </div>
    );
  }
}
