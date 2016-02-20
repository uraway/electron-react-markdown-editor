import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';

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

  postHatena() {
    ipcRenderer.send('postHatena', this.state.title, this.state.content, this.state.hatenaUsername, this.state.hatenaBlogId, this.state.hatenaApikey, this.state.category, this.state.draftStatus);
  }

  render() {
    let btnPublicClass = 'btn btn-default';
    if (!this.state.draftStatus) btnPublicClass += ' active';

    let btnDraftClass = 'btn btn-default';
    if (this.state.draftStatus) btnDraftClass += ' active';

    const { title, hatenaUsername, hatenaBlogId, hatenaApikey } = this.state;
    const { categoryItems, actions, entryCategory } = this.props;

    return (
          <form>
            <div className="form-group">
              <label>タイトル</label>
              <input className="form-control" placeholder="Entry Title" value={title} onChange={::this.handleTitleChange}/>
            </div>

            <div className="form-group">
              <label>カテゴリー</label>

            <p>
              {entryCategory.map(item =>
                <EntryCategory
                  key={item.id}
                  item={item}
                  {...actions}
                />
              )}
            </p>

              <ul className="list-group">
                <li className="list-header">
                  <label>カテゴリーリスト</label>
                  <p>
                    <CategoryItemInput
                      newItem
                      onSave={::this.handleSave}
                      placeholder="Add a new Category"
                    />
                </p>
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
              <label>エントリーの状態</label>
              <p>
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
              <label>はてなブログID</label>
              <input className="form-control" placeholder="Blog ID" value={hatenaBlogId} onChange={::this.handleHatenaBlogIdChange}/>
            </div>
            <div className="form-group">
              <label>はてなAPIKey</label>
              <input className="form-control" placeholder="API Key" type="password" value={hatenaApikey} onChange={::this.handleHatenaApikeyChange}/>
            </div>
            <div className="form-actions">
              <button onClick={::this.postHatena} type="submit" className="btn btn-form btn-primary">投稿する</button>
            </div>
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
