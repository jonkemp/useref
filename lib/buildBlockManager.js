const resources = require('./resources');
const sectionsJoinChar = resources.sectionsJoinChar;
const regend = resources.regend;
let sectionKey;

module.exports = {
  block: false,

  sections: {},

  sectionIndex: 0,

  last: null,

  removeBlockIndex: 0,

  getSectionKey({ attbs, type, target }) {
    let key;

    if (attbs) {
      key = [ type, target, attbs ].join(sectionsJoinChar);
    } else if (target) {
      key = [ type, target ].join(sectionsJoinChar);
    } else {
      key = type;
    }

    return key;
  },

  setSections(build) {
    if (build.type === 'remove') {
      build.target = String(this.removeBlockIndex++);
    }

    sectionKey = this.getSectionKey(build);

    if (this.sections[sectionKey]) {
      sectionKey += this.sectionIndex++;
    }

    this.sections[sectionKey] = this.last = [];
  },

  endbuild(line) {
    return regend.test(line);
  }
};
