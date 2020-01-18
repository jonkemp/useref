const resources = require('./resources');
const refManager = require('./refManager');

module.exports = (blocks, content, options) => {
  let replaced = content;
  const refm = Object.create(refManager);

  // Determine the linefeed from the content
  const linefeed = /\r\n/g.test(content) ? '\r\n' : '\n';

  // handle blocks
  Object.keys(blocks).forEach(key => {
    const block = blocks[key].join(linefeed);
    const lines = block.split(linefeed);
    const indent = (lines[0].match(/^\s*/) || [])[0];
    const ccmatches = block.match(resources.regcc);
    const blockContent = lines.slice(1, -1).join(linefeed);
    let ref = refm.getRef(block, blockContent, options);

    if (ref !== null) {
      ref = indent + ref;

      // Reserve IE conditional comment if exist
      if (ccmatches) {
        ref = indent + ccmatches[1] + linefeed + ref + linefeed + indent + ccmatches[2];
      }

      if (options.noconcat) {
        replaced = replaced.replace(block, blockContent);
      } else {
        replaced = replaced.replace(block, ref);
      }
    }
  });

  return replaced;
};
