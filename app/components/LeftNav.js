import React, { Component, PropTypes } from 'react';

class LeftNav extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleClickHatenaFormBtn() {
    this.props.toggleHatenaForm();
  }

  render() {
    const { toggleHatenaForm, toggleQuiitaForm, toggleTumblrForm } = this.props;

    return (
        <div className="pane pane-sm sidebar">
            <nav className="nav-group">
              <h5 className="nav-group-title">SNS</h5>
              <a className="nav-group-item" onClick={::this.handleClickHatenaFormBtn}>
                <span className="icon icon-home"></span>
                  はてなブログに投稿する
              </a>
{/*
              <a className="nav-group-item">
                <span className="icon icon-home"></span>
                Qiitaに投稿する
              </a>
              <a className="nav-group-item">
                <span className="icon icon-home"></span>
                Tumblrに投稿する
              </a>
*/}
            </nav>
        </div>
    );
  }
}

LeftNav.propsTypes = {
  toggleHatenaForm: PropTypes.func.isRequired,
};

export default LeftNav;
