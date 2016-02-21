import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';
import { open } from 'openurl';

import CategoryItemInput from './CategoryItemInput';
import CategoryItem from './CategoryItem';

import EntryCategory from './EntryCategory';

class HatenaForm extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      title: '',
      hatenaUsername: window.localStorage.getItem('hatenaUsername'),
      hatenaBlogId: window.localStorage.getItem('hatenaBlogId'),
      hatenaApikey: window.localStorage.getItem('hatenaApikey'),
      draftStatus: false,
      openAfterPost: false,
    });
  }

  componentDidMount() {
    ipcRenderer.on('Error', (event, err) => {
      console.error(err);
      alert('エラー\n' + err);
    });
    ipcRenderer.on('Response', (event, res) => {
      console.log(res);
      alert('はてなブログに投稿しました｡\n' + res);
      if (this.state.openAfterPost) {
        open(res);
      }

      window.localStorage.setItem('hatenaUsername', this.state.hatenaUsername);
      window.localStorage.setItem('hatenaBlogId', this.state.hatenaBlogId);
      window.localStorage.setItem('hatenaApikey', this.state.hatenaApikey);
    });

    ipcRenderer.on('hatenaOAuthResponse', (event, accessToken, accessTokenSecret) => {
      window.localStorage.setItem('hatenaAccessToken', accessToken);
      window.localStorage.setItem('hatenaAccessTokenSecret', accessTokenSecret);
    });
  }

  onClickedPublic() {
    this.setState({ draftStatus: false });
  }

  onClickedDraft() {
    this.setState({ draftStatus: true });
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

  handleSave(text) {
    if (text.length !== 0) {
      this.props.actions.addCategoryItem(text);
    }
  }

  handleClickOpenAfterPost() {
    if (this.state.openAfterPost) {
      this.setState({ openAfterPost: false });
    } else {
      this.setState({ openAfterPost: true });
    }
  }

  postHatena() {
    let categoryArray = [];
    for (let i = 0; i < this.props.entryCategory.length; i++) {
      console.log(this.props.entryCategory[i].text);
      categoryArray.push(this.props.entryCategory[i].text);
    }

    ipcRenderer.send('hatenaPostWsse', this.state.title, this.state.content, this.state.hatenaUsername, this.state.hatenaBlogId, this.state.hatenaApikey, categoryArray, this.state.draftStatus);
  }

  OAuthHatena() {
    let categoryArray = [];
    for (let i = 0; i < this.props.entryCategory.length; i++) {
      console.log(this.props.entryCategory[i].text);
      categoryArray.push(this.props.entryCategory[i].text);
    }

    let accessToken = window.localStorage.getItem('hatenaAccessToken');
    let accessTokenSecret = window.localStorage.getItem('hatenaAccessTokenSecret');
    console.log(accessToken);
    if (accessToken === null && accessTokenSecret === null) {
      ipcRenderer.send('hatenaOAuthRequest');
    } else {
      ipcRenderer.send('hatenaOAuthPostRequest', this.state.title, this.state.content, this.state.hatenaUsername, this.state.hatenaBlogId, categoryArray, this.state.draftStatus, accessToken, accessTokenSecret);
    }
  }

  handleClickHatenaBackBtn() {
    this.props.toggleHatenaForm();
  }

  render() {
    let btnPublicClass = 'btn btn-default pull-right';
    if (!this.state.draftStatus) btnPublicClass += ' active';

    let btnDraftClass = 'btn btn-default pull-right';
    if (this.state.draftStatus) btnDraftClass += ' active';

    const { title, hatenaUsername, hatenaBlogId, hatenaApikey, openAfterPost } = this.state;
    const { categoryItems, actions, entryCategory, toggleHatenaForm, toggleHatenaList } = this.props;

    return (
          <form className="pane-sm sidebar">
            <nav className="nav-group">
            <h5 className="nav-group-title">はてなブログ投稿フォーム</h5>
            <div className="form-actions nav-group-item">
              <button onClick={::this.handleClickHatenaBackBtn} type="submit" className="btn btn-form btn-primary">戻る</button>
            </div>
            <div className="form-group">
              <label className="nav-group-item">タイトル</label>
              <input autoFocus className="form-control" placeholder="Entry Title" value={title} onChange={::this.handleTitleChange}/>
            </div>

            <div className="form-group">
              <label className="nav-group-item">カテゴリー</label>

              {entryCategory.map(item =>
                <EntryCategory
                  key={item.id}
                  item={item}
                  {...actions}
                />
              )}

              <ul className="list-group">
                <li className="list-header">
                  <label className="nav-group-item">カテゴリーリスト</label>
                    <CategoryItemInput
                      newItem
                      onSave={::this.handleSave}
                      placeholder="Add a new Category"
                    />
                </li>

                <span>
                  {categoryItems.map(item =>
                    <CategoryItem
                      key={item.id}
                      item={item}
                      {...actions}
                    />
                  )}
                </span>
              </ul>
            </div>

            <div className="btn-group">
              <label className="nav-group-item">エントリーの状態</label>
              <p className="nav-group-item">
                <button
                  className={btnPublicClass}
                  onClick={::this.onClickedPublic}
                >
                公開
                </button>
                <button
                  className={btnDraftClass}
                  onClick={::this.onClickedDraft}
                >
                下書き
                </button>
              </p>
            </div>

            <div className="form-group">
              <label>はてなユーザー名</label>
              <input className="form-control" placeholder="username" value={hatenaUsername} onChange={::this.handleHatenaUsernameChange}/>
            </div>
            <div className="form-group">
              <label className="nav-group-item">はてなブログID</label>
              <input className="form-control" placeholder="Blog ID" value={hatenaBlogId} onChange={::this.handleHatenaBlogIdChange}/>
            </div>
            <div className="form-group">
              <label className="nav-group-item">はてなAPIKey</label>
              <input className="form-control" placeholder="API Key" type="password" value={hatenaApikey} onChange={::this.handleHatenaApikeyChange}/>
            </div>
            <div className="form-actions">
              <button onClick={::this.postHatena} type="submit" className="btn btn-form btn-primary pull-right">投稿する</button>
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" checked={openAfterPost} onClick={::this.handleClickOpenAfterPost} /> 投稿後ブラウザで開く
                </label>
              </div>

            <button onClick={() => toggleHatenaList()} className="btn btn-default">
              <span className="icon icon-popup icon-text"></span>
              リスト
            </button>
{/*
              <div className="form-actions">
                <button onClick={::this.OAuthHatena} type="submit" className="btn btn-form btn-primary">OAuth</button>
              </div>
*/}
          </nav>
          </form>
    );
  }
}

HatenaForm.propTypes = {
  content: PropTypes.string,
  actions: PropTypes.object.isRequired,
  addCategoryItem: PropTypes.func,
  entryCategory: PropTypes.array,
  categoryItems: PropTypes.array,
  editEntryCategory: PropTypes.func,
  addEntryCategory: PropTypes.func,
};

export default HatenaForm;
