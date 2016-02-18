import React, { Component, PropTypes } from 'react';

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
      <footer className="footer">
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default" onClick={::this.onClickedCloud}>
              <span className="icon icon-home icon-text"/>SNS
            </button>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
