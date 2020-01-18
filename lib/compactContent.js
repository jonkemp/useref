const parse = require('./parseBuildBlock');
const resources = require('./resources');
const sectionsJoinChar = resources.sectionsJoinChar;
const regComment = resources.regComment;

function removeComments(lines) {
  return lines.join('\n').replace(regComment, '').split('\n');
}

module.exports = (blocks, options) => {
  const result = {};
  const parseSourcePath = options.parseSourcePath || (tag => (tag.match(/(href|src)=(?:["']\W+\s*(?:\w+)\()?["']([^'"]+)['"]/) || [])[2]);

  Object.keys(blocks).forEach(dest => {
    // Lines are the included scripts w/o the use blocks
    let lines = blocks[dest].slice(1, -1);

    const parts = dest.split(sectionsJoinChar);
    const type = parts[0];

    const // output is the useref block file
      output = parts[1];

    const build = parse(blocks[dest][0]);
    let assets;

    // remove html comment blocks
    lines = removeComments(lines);

    // parse out the list of assets to handle, and update the config accordingly
    assets = lines.map(tag => {
      if (typeof(parseSourcePath) !== 'function') {
        throw new Error('options.parseSourcePath must be a function');
      }

      // call function to parse the asset path
      return parseSourcePath(tag, type);
    }).reduce((a, b) => b ? a.concat(b) : a, []);

    result[type] = result[type] || {};

    result[type][output] = {
      assets
    };

    if (build.alternateSearchPaths) {
      // Alternate search path
      result[type][output].searchPaths = build.alternateSearchPaths;
    }
  });

  return result;
};
