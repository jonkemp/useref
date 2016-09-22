'use strict';

var parseBuildBlock = require('./parseBuildBlock'),
  bb = {};

module.exports = {
  setBuildBlock: function (block, options) {
    var props = parseBuildBlock(block);

    bb.handler = options && options[props.type];
    bb.target = props.target || 'replace';
    bb.type = props.type;
    bb.attbs = props.attbs;
    bb.alternateSearchPaths = props.alternateSearchPaths;
    bb.strictCssXML =
    options && options.strictCssXML;
    bb.strictScriptXML =
    options && options.strictScriptXML;
  },

  transformCSSRefs: function (block, target, attbs) {
    var ref = '';

    // css link element regular expression
    // TODO: Determine if 'href' attribute is present.
    var regcss = /<?link.*?(?:>|\))/gmi;

    // end closing tag for the link element
    var closingTag = '>';

    // Check to see if there are any css references at all.
    if (block.search(regcss) !== -1) {
      if (bb && bb.strictCssXML) {
        // make end closing tag self closing
        // if strict XML type needed
        closingTag = '/>';
      }

      if (attbs) {
        ref = '<link rel="stylesheet" href="' + target + '" ' + attbs + closingTag;
      } else {
        ref = '<link rel="stylesheet" href="' + target + '"' + closingTag;
      }
    }

    return ref;
  },

  transformJSRefs: function (block, target, attbs) {
    var ref = '';

    // script element regular expression
    // TODO: Detect 'src' attribute.
    var regscript = /<?script\(?\b[^<]*(?:(?!<\/script>|\))<[^<]*)*(?:<\/script>|\))/gmi;

    // general closing for a script tag
    var closingTag = '</script>';

    // Check to see if there are any js references at all.
    if (block.search(regscript) !== -1) {
      if (bb && bb.strictScriptXML) {
        // append cdata block to script element
        // if strict XML type needed
        closingTag = '//<![CDATA[ //]]>' + closingTag;
      }

      if (attbs) {
        ref = '<script src="' + target + '" ' + attbs + '>' + closingTag;
      } else {
        ref = '<script src="' + target + '">' + closingTag;
      }
    }

    return ref;
  },

  getRef: function (block, blockContent, options) {
    var ref = '';

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
