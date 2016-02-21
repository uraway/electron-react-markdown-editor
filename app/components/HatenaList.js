import React, { Component, PropTypes } from 'react';

class HatenaList extends Component {
  render() {
    const { toggleHatenaList } = this.props;
    return (
      <div className="pane sidebar">
        <label><strong>はてなブログ エントリーリスト</strong></label>
        <div className="form-actions">
          <button onClick={() => toggleHatenaList()} type="submit" className="btn btn-form btn-primary">戻る</button>
        </div>
      <ul className="list-group">
        <li className="list-group-header">
          <input className="form-control" type="text" placeholder="Search for someone"/>
        </li>
        <li className="list-group-item">
          <img className="img-circle media-object pull-left" width="32" height="32"/>
          <div className="media-body">
            <strong>List item title</strong>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </li>
        <li className="list-group-item">
          <img className="img-circle media-object pull-left" width="32" height="32"/>
          <div className="media-body">
            <strong>List item title</strong>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </li>
      </ul>
      </div>
    );
  }
}

export default HatenaList;
