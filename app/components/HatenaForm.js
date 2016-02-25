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
      hatenaUsername: window.localStorage.getItem('hatenaUsername'),
      hatenaBlogId: window.localStorage.getItem('hatenaBlogId'),
      hatenaApikey: window.localStorage.getItem('hatenaApikey'),
      title: this.props.title || '',
      draftStatus: this.props.draftStatus || false,
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
    window.localStorage.setItem('hatenaUsername', this.state.hatenaUsername);
    window.localStorage.setItem('hatenaBlogId', this.state.hatenaBlogId);
    window.localStorage.setItem('hatenaApikey', this.state.hatenaApikey);
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
    const { categoryItems, actions, entryCategory, toggleHatenaList } = this.props;

    return (
          <ul className="pane pane-sm sidebar list-group">
            <li className="list-group-header">
              <h5>
                <strong>はてなブログ 投稿フォーム</strong>
              </h5>
                <button onClick={::this.handleClickHatenaBackBtn} type="submit" className="btn btn-form btn-default"><span className="icon icon-cancel-circled icon-text"></span>
                閉じる</button>
            </li>

            <li className="list-group-item">
              <h5><strong>タイトル</strong></h5>
              <input autoFocus className="form-control" placeholder="Entry Title" value={title} onChange={::this.handleTitleChange}/>
            </li>

            <li className="list-group-item">
              <h5><strong>カテゴリー</strong></h5>

              {entryCategory.map(item =>
                <EntryCategory
                  key={item.id}
                  item={item}
                  {...actions}
                />
              )}
            </li>
            <li className="list-group-item">
              <h5><strong>カテゴリーリスト</strong></h5>
                <CategoryItemInput
                  className="form-group"
                  newItem
                  onSave={::this.handleSave}
                  placeholder="Add a new category item"
                />
              <div>
                  {categoryItems.map(item =>
                    <CategoryItem
                      key={item.id}
                      item={item}
                      {...actions}
                    />
                  )}
              </div>
            </li>

            <li className="list-group-item btn-group">
              <h5><strong>エントリーの状態</strong></h5>
              <span>
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
              </span>
            </li>

            <li className="list-group-item">
              <h5><strong>はてなユーザー名</strong></h5>
              <input className="form-control" placeholder="username" value={hatenaUsername} onChange={::this.handleHatenaUsernameChange}/>
            </li>
            <li className="list-group-item">
              <h5><strong>はてなブログID</strong></h5><div onClick={() => open('http://blog.hatena.ne.jp/my/config')}>(確認する)</div>
              <input className="form-control" placeholder="Blog ID" value={hatenaBlogId} onChange={::this.handleHatenaBlogIdChange}/>
            </li>
            <li className="list-group-item">
              <h5><strong>はてなAPIKey</strong></h5><div onClick={() => open('http://blog.hatena.ne.jp/my/config/detail')}>(確認する)</div>
              <input className="form-control" placeholder="API Key" type="password" value={hatenaApikey} onChange={::this.handleHatenaApikeyChange}/>
            </li>
            <li className="list-group-item">
              <button onClick={::this.postHatena} type="submit" className="btn btn-form btn-primary">投稿する</button>
            </li>

            <li className="checkbox list-group-item">
              <label>
                <input type="checkbox" checked={openAfterPost} onClick={::this.handleClickOpenAfterPost} /> 投稿後ブラウザで開く
                </label>
              </li>
            <li className="list-group-item">
              <button onClick={() => toggleHatenaList()} className="btn btn-default">
                <span className="icon icon-popup icon-text"></span>
                リスト
              </button>
            </li>
        </ul>
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
  toggleHatenaForm: PropTypes.func.isRequired,
  toggleHatenaList: PropTypes.func.isRequired,
  newEntry: PropTypes.bool,
  title: PropTypes.string,
  draftStatus: PropTypes.func,
};

export default HatenaForm;
