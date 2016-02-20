import React, { Component, PropTypes } from 'react';

import CategoryItemInput from './CategoryItemInput';
import CategoryItem from './CategoryItem';

class HatenaForm extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      title: '',
      hatenaUsername: window.localStorage.getItem('hatenaUsername'),
      hatenaBlogId: window.localStorage.getItem('hatenaBlogId'),
      hatenaApikey: window.localStorage.getItem('hatenaApikey'),
      draftStatus: false,
      entryCategory: [],
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

  handleAddEntryCategory(text) {
    console.log(this.props.entryCategory);
    console.log(text);
    this.setState({ entryCategory: text });
  }

  render() {
    let btnPublicClass = 'btn btn-default';
    if (!this.state.draftStatus) btnPublicClass += ' active';

    let btnDraftClass = 'btn btn-default';
    if (this.state.draftStatus) btnDraftClass += ' active';

    const { title, hatenaUsername, hatenaBlogId, hatenaApikey, entryCategory } = this.state;
    const { categoryItems, actions } = this.props;


    return (
          <form>
            <div className="form-group">
              <label>タイトル</label>
              <input className="form-control" placeholder="Title" value={title} onChange={::this.handleTitleChange}/>
            </div>

            <div className="form-group">
              <label>カテゴリー</label>
              <span>{entryCategory}</span>
              <ul className="list-group">
                <li className="list-header">
                  <CategoryItemInput
                    newItem
                    onSave={::this.handleSave}
                    placeholder="Add a new Category item"
                  />
                </li>

                <li className="list-group-item">
                  {categoryItems.map(item =>
                    <CategoryItem key={item.id} item={item} {...actions} onClickedItem={::this.handleAddEntryCategory}/>
                  )}
                </li>
              </ul>
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
              <button type="submit" className="btn btn-form btn-default">Cancel</button>
              <button type="submit" className="btn btn-form btn-primary">OK</button>
            </div>
          </form>
    );
  }
}

HatenaForm.propsTypes = {
  content: PropTypes.string,
  addCategoryItem: PropTypes.func.isRequired,
};

export default HatenaForm;
