const parseBuildBlock = require('./parseBuildBlock');
const bb = {};

module.exports = {
  setBuildBlock(block, options) {
    const props = parseBuildBlock(block);
    const transformTargetPath = options.transformTargetPath;

    bb.handler = options && options[props.type];
    bb.target = props.target || 'replace';
    bb.type = props.type;
    bb.attbs = props.attbs;
    bb.alternateSearchPaths = props.alternateSearchPaths;

    // transform target file path
    if (typeof(transformTargetPath) === 'function') {
      bb.target = transformTargetPath(bb.target, bb.type);
    }
  },

  transformCSSRefs(block, target, attbs) {
    let ref = '';
    let rel = 'rel="stylesheet" ';

    // css link element regular expression
    // TODO: Determine if 'href' attribute is present.
    const regcss = /<?link.*?(?:>|\))/gmi;

    // rel attribute regular expression
    const regrel = /(^|\s)rel=/i;

    // if rel exists in attributes, set the default one empty
    if (regrel.test(attbs)) {
      rel = '';
    }

    // Check to see if there are any css references at all.
    if (block.search(regcss) !== -1) {
      if (attbs) {
        ref = `<link ${rel}href="${target}" ${attbs}>`;
      } else {
        ref = `<link ${rel}href="${target}">`;
      }
    }

    return ref;
  },

  transformJSRefs(block, target, attbs) {
    let ref = '';

    // script element regular expression
    // TODO: Detect 'src' attribute.
    const regscript = /<?script\(?\b[^<]*(?:(?!<\/script>|\))<[^<]*)*(?:<\/script>|\))/gmi;

    // Check to see if there are any js references at all.
    if (block.search(regscript) !== -1) {
      if (attbs) {
        ref = `<script src="${target}" ${attbs}></script>`;
      } else {
        ref = `<script src="${target}"></script>`;
      }
    }

    return ref;
  },

  getRef(block, blockContent, options) {
    let ref = '';

    this.setBuildBlock(block, options);

    if (bb.type === 'css') {
      ref = this.transformCSSRefs(blockContent, bb.target, bb.attbs);
    } else if (bb.type === 'js') {
      ref = this.transformJSRefs(blockContent, bb.target, bb.attbs);
    } else if (bb.type === 'remove') {
      ref = '';
    } else if (bb.handler) {
      ref = bb.handler(blockContent, bb.target, bb.attbs, bb.alternateSearchPaths);
    } else {
      ref = null;
    }

    return ref;
  }
};
