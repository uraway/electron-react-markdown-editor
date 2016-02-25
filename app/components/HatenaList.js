import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';
import parse from 'xml-parser';
import { open } from 'openurl';

class HatenaList extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      hatenaUsername: window.localStorage.getItem('hatenaUsername'),
      hatenaBlogId: window.localStorage.getItem('hatenaBlogId'),
      hatenaApikey: window.localStorage.getItem('hatenaApikey'),
      id: '',
      title: '',
      category: [],
      draftStatus: '',
      nextURL: '',
      blogTitle: '',
      blogURL: '',
    });
  }

  componentDidMount() {
    ipcRenderer.on('hatenaGETResponse', (event, res) => {
      const obj = parse(res);
      const nextURL = obj.root.children[1].attributes.href;
      const blogTitle = obj.root.children[2].content;
      const blogURL = obj.root.children[3].attributes.href;

      this.setState({
        nextURL: nextURL,
        blogTitle: blogTitle,
        blogURL: blogURL,
      });

      /* make loop children[i]
       * 8 <= i <= 17
       */
      let object = obj.root;
      for (let i = 17; i > 7; i--) {
        let entryId = object.children[i].children[0].content;
        let entryTitle = object.children[i].children[4].content;
        let summary = object.children[i].children[8].content;
        let content = object.children[i].children[9].content;

        let category = [];
        let draftStatus;

        this.props.deleteHatenaEntry(entryId);
        this.props.addHatenaEntry(entryId, entryTitle, summary, content);
      }

      /*
      let updatedTime = obj.root.children[8].children[5].content;
      let publishedTime = obj.root.children[8].children[6].content;
      let summary = obj.root.children[8].children[8].content;

      let category1 = obj.root.children[8].children[11].attributes.term;
      let category2 = obj.root.children[8].children[12].attributes.term;
      let category3 = obj.root.children[8].children[13].attributes.term;

      let draftStatus = obj.root.children[8].children[14].children[0].content;
      */
    });
  }

  onClickedPublic() {
    this.setState({ draftStatus: false });
  }

  onClickedDraft() {
    this.setState({ draftStatus: true });
  }

  handleClickCCW() {
    const params = '';
    this.hatenaGETRequest(params);
  }

  hatenaGETRequest(params) {
    ipcRenderer.send('hatenaGETRequest', this.state.hatenaUsername, this.state.hatenaBlogId, this.state.hatenaApikey, params);
  }

  handleClickHatenaFormBackBtn() {
    this.props.toggleHatenaList();
  }

  handleDoubleClick(entryId, entryTitle, content) {
    this.props.updateMarkdown(content);
    this.setState({
      id: entryId,
      title: entryTitle,
    });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  render() {
    const { blogTitle, blogURL, nextURL, title } = this.state;
    const { hatenaEntry } = this.props;

    let btnPublicClass = 'btn btn-default pull-right';
    if (!this.state.draftStatus) btnPublicClass += ' active';

    let btnDraftClass = 'btn btn-default pull-right';
    if (this.state.draftStatus) btnDraftClass += ' active';

    return (
      <ul className="pane sidebar list-group">

        <div className="list-group-header">
          <h6><strong>はてなブログ エントリーリスト</strong></h6>
          <div className="form-actions">
            <button onClick={::this.handleClickCCW} className="btn btn-form btn-default">
              <span className="icon icon-arrows-ccw"></span>
            </button>

            <button onClick={::this.handleClickHatenaFormBackBtn} type="submit" className="btn btn-form btn-default"><span className="icon icon-cancel-circled icon-text"></span>
              閉じる
            </button>
          </div>
        </div>

      <ul className="list-group">
        {hatenaEntry.map((item) => {
          return (
            <li key={item.id} className="list-group-item">
              <div className="media-body" onDoubleClick={() => this.handleDoubleClick(item.id, item.title, item.content)}>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </ul>
    );
  }
}

HatenaList.propTypes = {
  hatenaEntry: PropTypes.array,
  updateMarkdown: PropTypes.func.isRequired,
  addHatenaEntry: PropTypes.func.isRequired,
  deleteHatenaEntry: PropTypes.func.isRequired,
  toggleHatenaList: PropTypes.func.isRequired,
};

export default HatenaList;
