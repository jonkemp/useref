/* eslint-disable */
/* global describe, it */
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const useRef = require('../index');

function djoin(p) {
  return path.normalize(path.join(__dirname, p));
}
function fread(f) {
  return fs.readFileSync(f, { encoding: 'utf-8'});
}

describe('html-ref-replace', () => {

  it('should replace reference in css block and return replaced files', () => {
    const result = useRef(fread(djoin('testfiles/01.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/01-expected.html')));
    expect(result[1]).to.eql({ css: { '/css/combined.css': { 'assets': [ '/css/one.css', '/css/two.css' ] }}});
  });

  it('should replace reference in js block and return replaced files', () => {
    const result = useRef(fread(djoin('testfiles/02.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/02-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should not replace reference in css block with noconcat option', () => {
    const result = useRef(fread(djoin('testfiles/01.html')), { noconcat: true });
    expect(result[0]).to.equal(fread(djoin('testfiles/noconcat-css.html')));
  });

  it('should not replace reference in js block with noconcat option', () => {
    const result = useRef(fread(djoin('testfiles/02.html')), { noconcat: true });
    expect(result[0]).to.equal(fread(djoin('testfiles/noconcat-js.html')));
  });

  it('should remove `remove` block', () => {
    const result = useRef(fread(djoin('testfiles/09.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/09-expected.html')));
    expect(result[1]).to.eql({ remove: { '0': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should remove multiple `remove` blocks', () => {
    const result = useRef(fread(djoin('testfiles/10.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/10-expected.html')));
    expect(result[1]).to.eql({ remove: { '0': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }, '1': { 'assets': [ '/css/one.css', '/css/two.css' ] } }});
  });

  it('should handle comments and whitespace in blocks', () => {
    const result = useRef(fread(djoin('testfiles/03.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/03-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should handle comments and whitespace in blocks (without trailing space)', () => {
    const result = useRef(fread(djoin('testfiles/03b.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/03-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should ignore script in comments (multi line)', () => {
    const result = useRef(fread(djoin('testfiles/03c.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/03-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js' ] }}});
  });

  it('should ignore script in comments (single line with "<!--script" )', () => {
    const result = useRef(fread(djoin('testfiles/03d.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/03-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js' ] }}});
  });

  it('should ignore script in comments (single line with "<!--<script" )', () => {
    const result = useRef(fread(djoin('testfiles/03e.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/03-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js' ] }}});
  });

  it('should ignore script in comments (single line with "<!-- <script" )', () => {
    const result = useRef(fread(djoin('testfiles/03f.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/03-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js' ] }}});
  });

  it('should handle multiple blocks', () => {
    const result = useRef(fread(djoin('testfiles/04.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/04-expected.html')));
    expect(result[1]).to.eql({
      js: {
        'scripts/combined.concat.min.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] },
        'scripts/combined2.concat.min.js': { 'assets': [ 'scripts/anotherone.js', 'scripts/yetonemore.js' ] }
      },
      css: {
        '/css/combined.css': { 'assets': [ '/css/one.css', '/css/two.css' ] },
        '/css/combined2.css': { 'assets': [ '/css/three.css', '/css/four.css' ] }
      }
    });
  });

  it('should remove empty blocks', () => {
    const result = useRef(fread(djoin('testfiles/08.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/08-expected.html')));
  });

  it('should return the alternate search path in css block', () => {
    const result = useRef(fread(djoin('testfiles/05.html')));
    expect(result[1].css['/css/combined.css'].searchPaths).to.equal('.tmp');
  });

  it('should return the alternate search path in js block', () => {
    const result = useRef(fread(djoin('testfiles/06.html')));
    expect(result[1].js['scripts/combined.concat.min.js'].searchPaths).to.equal('{.tmp,app}');
  });

  it('should return the alternate search path in multiple blocks', () => {
    const result = useRef(fread(djoin('testfiles/07.html')));
    expect(result[1].js['scripts/combined2.min.js'].searchPaths).to.equal('.tmp');
  });

  it('should replace js blocks with async', () => {
    const result = useRef(fread(djoin('testfiles/12.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/12-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.async.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should replace js blocks with data-main', () => {
    const result = useRef(fread(djoin('testfiles/13.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/13-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/bootstrap.js': { 'assets': [ 'config.js', '../bower_components/requirejs/require.js' ] }}});
  });

  it('should replace js blocks with data-main and async', () => {
    const result = useRef(fread(djoin('testfiles/14.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/14-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/bootstrap.js': { 'assets': [ 'config.js', '../bower_components/requirejs/require.js' ] }}});
  });

  it('should replace css blocks with attributes', () => {
    const result = useRef(fread(djoin('testfiles/15.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/15-expected.html')));
    expect(result[1]).to.eql({ css: { '/css/combined.css': { 'assets': [ '/css/one.css', '/css/two.css' ] }}});
  });

  it('should replace css blocks with rel', () => {
    const result = useRef(fread(djoin('testfiles/15-rel.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/15-rel-expected.html')));
    expect(result[1]).to.eql({ css: { '/css/combined.css': { 'assets': [ '/css/one.css', '/css/two.css' ] }}});
  });

  it('should reserve IE conditional comments', () => {
    const result = useRef(fread(djoin('testfiles/16.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/16-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should reserve IE conditional comments with Windows-style line breaks', () => {
    const result = useRef(fread(djoin('testfiles/16-win.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/16-win-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.js': { 'assets': [ 'scripts/this.js', 'scripts/that.js' ] }}});
  });

  it('should support symfony2 twig and laravel5 blade assets', () => {
    const result = useRef(fread(djoin('testfiles/27.asset.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/27.asset-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.js': { 'assets': [ 'symfony/js/script.js', 'laravel/js/script.js' ] }}});
  });

  it('should replace css blocks with attributes containing `:` and parenthesis', () => {
    const result = useRef(fread(djoin('testfiles/17.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/17-expected.html')));
    expect(result[1]).to.eql({ css: { '/css/styles.css': { 'assets': [ '/css/styles.css' ] }}});
  });

  it('should prevent just comments or whitespace from producing a css reference', () => {
      const result = useRef(fread(djoin('testfiles/18.html')));
      expect(result[0]).to.equal(fread(djoin('testfiles/18-expected.html')));
      expect(result[1]).to.eql({ css: { '/css/styles.css': { 'assets': [] }}});
  });

  it('should prevent just comments or whitespace from producing a js reference', () => {
      const result = useRef(fread(djoin('testfiles/19.html')));
      expect(result[0]).to.equal(fread(djoin('testfiles/19-expected.html')));
      expect(result[1]).to.eql({ js: { '/js/scripts.js': { 'assets': [] }}});
  });

  it('should detect script tag with whitespace text', () => {
      const result = useRef(fread(djoin('testfiles/20.html')));
      expect(result[0]).to.equal(fread(djoin('testfiles/20-expected.html')));
      expect(result[1]).to.eql({ js: { 'scripts/combined.js': { 'assets': [ 'config.js' ] }}});
  });

  it('should work on URLs with special characters', () => {
    const result = useRef(fread(djoin('testfiles/21.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/21-expected.html')));
    expect(result[1]).to.eql({ js: { 'scripts/combined.concat.min.js': { 'assets': [ 'http://fonts.googleapis.com/css?family=Open+Sans:400,300,600' ] }}});
  });

  it('should allow custom blocks', () => {
    const result = useRef(fread(djoin('testfiles/22.html')), {
      test(content, target, options) {
        return content.replace('bower_components', target);
      }
    });
    expect(result[0]).to.equal(fread(djoin('testfiles/22-expected.html')));
    expect(result[1]).to.eql({ test: { components: { 'assets': [ '/bower_components/some/path' ] }}});
  });

  it('should silently ignore unexisting blocks', () => {
    const result = useRef(fread(djoin('testfiles/23.html')));
    expect(result[0]).to.equal(fread(djoin('testfiles/23.html')));
    expect(result[1]).to.eql({ invalidblock: { components: { 'assets': [ '/bower_components/some/path' ] }}});
  });

  it('should pass alternateSearchPath to the custom block handler', () => {
    useRef(fread(djoin('testfiles/24.html')), {
      test(content, target, options, alternateSearchPath) {
        expect(alternateSearchPath).to.equal('{.tmp,app}');
      }
    });
  });

  it('should handle multiple identical blocks separately', () => {
    const result = useRef(fread(djoin('testfiles/25.html')), {
      testSame(content, target) {
        return target;
      }
    });
    expect(result[0]).to.equal(fread(djoin('testfiles/25-expected.html')));
    expect(result[1]).to.eql({ testSame: { target: { 'assets': [] }, target0: { 'assets': [] }}});
  });

  it('should handle jade files', () => {
    const result = useRef(fread(djoin('testfiles/26.jade')));
    expect(result[0]).to.equal(fread(djoin('testfiles/26-expected.jade')));
    expect(result[1]).to.eql({
      css: {
        '/styles/vendor.css': {
          'assets': [ '/bower_components/some_module/main.css' ],
          'searchPaths': '{.tmp/serve,src}'
        }
      },
      js: {
        '/scripts/vendor.js': {
          'assets': [ '/bower_components/jquery/dist/jquery.js' ],
          'searchPaths': '{.tmp/serve,src}'
        },
        '/scripts/app.js': {
          'assets': [ '/config.js' ],
          'searchPaths': '{src,.tmp/serve}'
        }
      }
    });
  });

  it('should parse and transform source and target path', () => {
    const result = useRef(fread(djoin('testfiles/28.html')), {
      parseSourcePath(tag) {
        return (tag.match(/(src|href)\s*=\s*['"]\$\{url\('([^']+)'\)\}['"]/) || [])[2];
      },
      transformTargetPath(target) {
        return '${url(\'' + target + '\')}';
      }
    });
    expect(result[0]).to.equal(fread(djoin('testfiles/28-expected.html')));
    expect(result[1]).to.eql({
      js: {
        '/js/combined.js': {
          'assets': [ '/js/script1.js', '/js/script2.js' ],
        },
      }
    });
  });
});
