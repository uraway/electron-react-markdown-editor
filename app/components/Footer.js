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
        <button className="btn btn-default" onClick={::this.onClickedCloud}>
          <span className="icon icon-cloud"/>
        </button>
      </footer>
    );
  }
}

export default Footer;
