import React, { Component } from 'react';

import InputArea from './InputArea';
import PreviewArea from './PreviewArea';

import ipc from 'ipc';

import Header from './Header';
import Footer from './Footer';

const initialContent = '# This is markdown editor with Electron and Ace.';

class Editor extends Component {
  constructor() {
    super();
    this.state = ({ content: initialContent });
  }

  componentDidMount() {
    ipc.on('fileContent', fileData => {
      this.setState({ content: fileData });
    });
    ipc.on('saveFile', () => {
      ipc.send('contentToSave', this.state.content);
    });
  }

  handleUserInput(newContent) {
    this.setState({ content: newContent });
  }

  render() {
    const { content } = this.state;
    return (
      <div className="editor">
        <div className="container">
          <div>
            <div className="col">
              <InputArea content={content} onUserInput={::this.handleUserInput} />
            </div>
            <div className="col">
              <PreviewArea content={content}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
