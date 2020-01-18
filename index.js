const getBlocks = require('./lib/getBlocks');
const transformReferences = require('./lib/transformReferences');
const compactContent = require('./lib/compactContent');

module.exports = (content, options) => {
  const blocks = getBlocks(content);
  const opts = options || {};
  const transformedContent = transformReferences(blocks, content, opts);
  const replaced = compactContent(blocks, opts);

  return [ transformedContent, replaced ];
};
