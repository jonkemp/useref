// start build pattern: <!-- build:[target] output -->
// $1 is the type, $2 is the alternate search path, $3 is the destination file name $4 extra attributes
const regbuild = /(?:<!--|\/\/-)\s*build:(\w+)(?:\(([^)]+)\))?\s*([^\s]+(?=-->)|[^\s]+)?\s*(?:(.*))?\s*-->/;

// end build pattern -- <!-- endbuild -->
const regend = /(?:<!--|\/\/-)\s*endbuild\s*-->/;

// IE conditional comment pattern: $1 is the start tag and $2 is the end tag
const regcc = /(<!--\[if\s.*?\]>)[\s\S]*?(<!\[endif\]-->)/i;

// Character used to create key for the `sections` object. This should probably be done more elegantly.
const sectionsJoinChar = '\ue000';

// strip all comments from HTML except for conditionals
const regComment = /<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->)(.|\n))*-->/g;

module.exports = {
  regbuild,
  regend,
  regcc,
  sectionsJoinChar,
  regComment
};
