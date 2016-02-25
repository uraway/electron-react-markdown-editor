import React, { Component, PropTypes } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import { ipcRenderer, clipboard } from 'electron';

import 'brace/mode/markdown';
import 'brace/theme/github';

class InputArea extends Component {
  handleChange(newContent) {
    this.props.updateMarkdown(newContent);
  }

  imageUpload() {
    let image = clipboard.readImage();
    let imagePng = image.toPng();

    ipcRenderer.send('postImage', image, imagePng);
  }

  componentDidMount() {
    ipcRenderer.on('postImageResponse', (event, res) => {
      console.log(res);
    });
  }

  render() {
    const { markdown } = this.props;
    return (
        <AceEditor
          className="input-area"
          mode="markdown"
          theme="github"
          name="UNIQUE_ID_OF_DIV"
          value={markdown}
          onChange={::this.handleChange}
          onPaste={::this.imageUpload}
          maxLines={9999}
          minLines={50}
          highlightActiveLine
          editorProps={{ $blockScrolling: true }}
          width="100%"
          wrapEnabled
        />
    );
  }
}

InputArea.propTypes = {
  updateMarkdown: PropTypes.func.isRequired,
  markdown: PropTypes.string,
};

export default InputArea;
