import React, { Component, PropTypes } from 'react';
import marked from 'marked';

class PreviewArea extends Component {

  rawMarkup() {
    const rawMarkup = marked(this.props.markdown,
      {
        sanitize: true,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        smartLists: true,
        smartypants: true,
      });
    return { __html: rawMarkup };
  }

  render() {
    return (
      <div
        className="preview-area markdown-body"
        dangerouslySetInnerHTML={this.rawMarkup()}
      />
    );
  }
}

PreviewArea.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default PreviewArea;
