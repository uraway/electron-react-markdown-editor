import React, { Component, PropTypes } from 'react';
import { open } from 'openurl';

class Footer extends Component {
  static propTypes = {
    toggleLeftNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  onClickedCloud() {
    this.props.toggleLeftNav();
  }

  render() {
    return (
      <footer className="toolbar toolbar-header">
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default" onClick={::this.onClickedCloud}>
              <span className="icon icon-home icon-text"/>SNS
            </button>
          </div>
          <button className="btn btn-primary pull-right" onClick={() => open('https://github.com/uraway/electron-react-markdown-editor')}>
            <span className="icon icon-github"></span>
          </button>
        </div>
      </footer>
    );
  }
}

export default Footer;
