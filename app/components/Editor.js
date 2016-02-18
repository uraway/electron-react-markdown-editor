import React, { Component } from 'react';
import { ipcRenderer, autoUpdater } from 'electron';

import InputArea from './InputArea';
import PreviewArea from './PreviewArea';
import Footer from './Footer';

const initialContent = '# This is markdown editor with Electron and Ace.';

class Editor extends Component {
  constructor() {
    super();
    this.state = ({
      content: initialContent,
      isShowLeftNav: false,
      isShowHatenaForm: false,
      title: '',
      hatenaUsername: window.localStorage.getItem('hatenaUsername'),
      hatenaBlogId: window.localStorage.getItem('hatenaBlogId'),
      hatenaApikey: window.localStorage.getItem('hatenaApikey'),
      category: '',
      draftStatus: false,
    });
  }

  componentDidMount() {
    ipcRenderer.on('fileContent', (event, fileData) => {
      this.setState({ content: fileData });
    });
    ipcRenderer.on('saveFile', () => {
      ipcRenderer.send('contentToSave', this.state.content);
    });
    ipcRenderer.on('Error', (event, err) => {
      console.error(err);
      alert('エラー\n' + err);
    });
    ipcRenderer.on('Response', (event, res) => {
      console.log(res);
      alert('はてなブログに投稿しました｡\n' + res);
    });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleHatenaUsernameChange(e) {
    this.setState({ hatenaUsername: e.target.value });
  }

  handleHatenaBlogIdChange(e) {
    this.setState({ hatenaBlogId: e.target.value });
  }

  handleHatenaApikeyChange(e) {
    this.setState({ hatenaApikey: e.target.value });
  }

  toggleHatenaForm() {
    if (this.state.isShowHatenaForm) {
      this.setState({ isShowHatenaForm: false });
    } else {
      this.setState({ isShowHatenaForm: true });
    }
  }

  postHatena() {
    ipcRenderer.send('hatenaPostWsse', this.state.title, this.state.content, this.state.hatenaUsername, this.state.hatenaBlogId, this.state.hatenaApikey, this.state.category, this.state.draftStatus);

    window.localStorage.setItem('hatenaUsername', this.state.hatenaUsername);
    window.localStorage.setItem('hatenaBlogId', this.state.hatenaBlogId);
    window.localStorage.setItem('hatenaApikey', this.state.hatenaApikey);
  }

  toggleLeftNav() {
    if (this.state.isShowLeftNav) {
      // hide all nav
      this.setState({
        isShowLeftNav: false,
        isShowHatenaForm: false,
      });
    } else {
      this.setState({
        isShowLeftNav: true,
        isShowHatenaForm: false,
      });
    }
  }

  handleUserInput(newContent) {
    this.setState({ content: newContent });
  }

  onClickedPublic() {
    this.setState({ draftStatus: false });
  }

  onClickedDraft() {
    this.setState({ draftStatus: true });
  }

  render() {
    const { content, isShowLeftNav, isShowHatenaForm, title, category, hatenaUsername, hatenaBlogId, hatenaApikey } = this.state;
    let leftNav;
    if (isShowLeftNav) {
      leftNav = (
        <div className="pane-sm sidebar">
        <nav className="nav-group">
          <h5 className="nav-group-title">SNS</h5>
        <a className="nav-group-item" onClick={::this.toggleHatenaForm}>
          <span className="icon icon-home"></span>
          はてなブログに投稿
        </a>
      </nav>
    </div>
      );
    } else {
      leftNav = null;
    }

    let btnPublicClass = 'btn btn-default';
    if (!this.state.draftStatus) btnPublicClass += ' active';

    let btnDraftClass = 'btn btn-default';
    if (this.state.draftStatus) btnDraftClass += ' active';

    let hatenaForm;
    if (isShowHatenaForm) {
      hatenaForm = (
        <form>
          <div className="form-group">
            <label>タイトル</label>
            <input className="form-control" placeholder="Title" value={title} onChange={::this.handleTitleChange}/>
          </div>
          <div className="form-group">
            <label>カテゴリ</label>
            <input className="form-control" placeholder="Category 調整中" value={category} />
          </div>
          <div className="btn-group">
            <button className={btnPublicClass} onClick={::this.onClickedPublic}>
              公開
            </button>
            <button className={btnDraftClass} onClick={::this.onClickedDraft}>
              下書き
            </button>
          </div>
          <div className="form-group">
            <label>はてなユーザー名</label>
            <input className="form-control" placeholder="username" value={hatenaUsername} onChange={::this.handleHatenaUsernameChange}/>
          </div>
          <div className="form-group">
            <label>はてなブログID</label>
            <input className="form-control" placeholder="Blog ID" value={hatenaBlogId} onChange={::this.handleHatenaBlogIdChange}/>
          </div>
          <div className="form-group">
            <label>はてなAPIKey</label>
            <input className="form-control" placeholder="API Key" type="password" value={hatenaApikey} onChange={::this.handleHatenaApikeyChange}/>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-form btn-default" onClick={::this.toggleHatenaForm}>Cancel</button>
            <button type="submit" className="btn btn-form btn-primary" onClick={::this.postHatena}>OK</button>
          </div>
        </form>
      );
    } else {
      hatenaForm = null;
    }

    return (
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            {leftNav}{hatenaForm}
            <div className="pane">
              <InputArea content={content} onUserInput={::this.handleUserInput} />
            </div>
            <div className="pane">
              <PreviewArea content={content}/>
            </div>
          </div>
        </div>
        <Footer className="toolbar toolbar-footer" toggleLeftNav={::this.toggleLeftNav} />
      </div>
    );
  }
}

export default Editor;
