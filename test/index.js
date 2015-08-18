import path from 'path';
import { assert, test as helpers } from 'yeoman-generator';
import mockery from 'mockery';

const expectedFiles = [
  'dist/app.min.css',
  'dist/bundle.min.js',
  'dist/vendors.min.js',
  'images/apple-touch-icon.png',
  'images/tile-wide.png',
  'images/tile.png',
  'sass/base/_base.scss',
  'sass/components/.gitkeep',
  'sass/layout/.gitkeep',
  'sass/pages/.gitkeep',
  'sass/themes/.gitkeep',
  'sass/utils/_functions.scss',
  'sass/utils/_mixins.scss',
  'sass/utils/_placeholders.scss',
  'sass/utils/_variables.scss',
  'sass/vendors/.gitkeep',
  'sass/app.scss',
  'scripts/vendors/.gitkeep',
  'scripts/app.js',
  'test/index.js',
  '404.html',
  '.gitignore',
  '.tern-project',
  'browserconfig.xml',
  'crossdomain.xml',
  'favicon.ico',
  'gulpfile.babel.js',
  'humans.txt',
  'index.html',
  'LICENSE.txt',
  'package.json',
  'README.md',
  'robots.txt'
];

describe('generator-fe-stack', () => {
  before(() => {
    mockery.enable({warnOnUnregistered: false});
    mockery.registerMock('github', () => {
      return {
        user: {
          getFrom(data, cb) {
            cb(null, {
              login: 'johndoe',
              name: 'John Doe',
              email: 'johndoe@gmail.com',
              html_url: 'https://github.com/johndoe'
            });
          }
        }
      };
    });
  });

  describe('selecting all', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          githubUser: 'johndoe',
          websiteName: 'john doe website',
          cssAssets: [ 'includeNormalizeCss', 'includeIncludeMedia', 'includeAnimateCss', 'includeSusy', 'includeJeet', 'includeBootstrap', 'includeFoundation', 'includePureCss', 'includeSemanticUi' ],
          jsAssets: [ 'includeBabel', 'includeJquery', 'includeLodash' ]
        })
        .on('end', done);
    });

    it('creates expected files', () => {
      assert.file(expectedFiles);
    });

    it('fills package.json with correct information', () => {
      assert.fileContent('package.json', /"name": "john-doe-website"/);
      assert.fileContent('package.json', /"repository": "johndoe\/john-doe-website"/);
      assert.fileContent('package.json', /"name": "John Doe"/);
      assert.fileContent('package.json', /"email": "johndoe@gmail.com"/);
      assert.fileContent('package.json', /"url": "https:\/\/github.com\/johndoe"/);

      assert.fileContent('package.json', /"normalize.css"/);
      assert.fileContent('package.json', /"include-media"/);
      assert.fileContent('package.json', /"animate.css"/);
      assert.fileContent('package.json', /"susy"/);
      assert.fileContent('package.json', /"jeet"/);
      assert.fileContent('package.json', /"bootstrap-sass"/);
      assert.fileContent('package.json', /"foundation-sites"/);
      assert.fileContent('package.json', /"purecss"/);
      assert.fileContent('package.json', /"semantic-ui-css"/);
      assert.fileContent('package.json', /"jquery"/);
      assert.fileContent('package.json', /"lodash"/);
      assert.fileContent('package.json', /"babel-core"/);
      assert.fileContent('package.json', /"babelify"/);
    });

    it('fills app.scss with correct information', () => {
      assert.fileContent('sass/app.scss', /vendors\/include-media/);
      assert.fileContent('sass/app.scss', /vendors\/animate/);
      assert.fileContent('sass/app.scss', /vendors\/susy\/susy/);
      assert.fileContent('sass/app.scss', /vendors\/jeet\/index/);
      assert.fileContent('sass/app.scss', /vendors\/bootstrap\/bootstrap/);
      assert.fileContent('sass/app.scss', /vendors\/foundation\/foundation/);
      assert.fileContent('sass/app.scss', /vendors\/pure/);
      assert.fileContent('sass/app.scss', /vendors\/semantic/);
    });

    it('fills humans.txt with correct information', () => {
      assert.fileContent('humans.txt', /John Doe -- Creator -- johndoe@gmail.com/);
    });

    it('fills index.html with correct information', () => {
      assert.fileContent('index.html', /<title>John Doe Website/);
      assert.fileContent('index.html', /<meta name="author" content="John Doe">/);
    });

    it('fills LICENSE.txt with correct information', () => {
      assert.fileContent('LICENSE.txt', /John Doe/);
    });

    it('fills README.md with correct information', () => {
      assert.fileContent('README.md', /# John Doe Website/);
    });
  });

  describe('selecting defaults', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          githubUser: 'johndoe',
          websiteName: 'john doe website',
          cssAssets: [ 'includeNormalizeCss' ],
          jsAssets: [ 'includeBabel', 'includeJquery' ]
        })
        .on('end', done);
    });

    it('creates expected files', () => {
      assert.file(expectedFiles);
    });

    it('fills package.json with correct information', () => {
      assert.fileContent('package.json', /"name": "john-doe-website"/);
      assert.fileContent('package.json', /"repository": "johndoe\/john-doe-website"/);
      assert.fileContent('package.json', /"name": "John Doe"/);
      assert.fileContent('package.json', /"email": "johndoe@gmail.com"/);
      assert.fileContent('package.json', /"url": "https:\/\/github.com\/johndoe"/);

      assert.fileContent('package.json', /"normalize.css"/);
      assert.noFileContent('package.json', /"include-media"/);
      assert.noFileContent('package.json', /"animate.css"/);
      assert.noFileContent('package.json', /"susy"/);
      assert.noFileContent('package.json', /"jeet"/);
      assert.noFileContent('package.json', /"bootstrap-sass"/);
      assert.noFileContent('package.json', /"foundation-sites"/);
      assert.noFileContent('package.json', /"purecss"/);
      assert.noFileContent('package.json', /"semantic-ui-css"/);
      assert.fileContent('package.json', /"jquery"/);
      assert.noFileContent('package.json', /"lodash"/);
      assert.fileContent('package.json', /"babel-core"/);
      assert.fileContent('package.json', /"babelify"/);
    });

    it('fills app.scss with correct information', () => {
      assert.fileContent('sass/app.scss', /vendors\/normalize/);
      assert.noFileContent('sass/app.scss', /vendors\/animate/);
      assert.noFileContent('sass/app.scss', /vendors\/susy\/susy/);
      assert.noFileContent('sass/app.scss', /vendors\/jeet\/index/);
      assert.noFileContent('sass/app.scss', /vendors\/bootstrap\/bootstrap/);
      assert.noFileContent('sass/app.scss', /vendors\/foundation\/foundation/);
      assert.noFileContent('sass/app.scss', /vendors\/pure/);
      assert.noFileContent('sass/app.scss', /vendors\/semantic/);
    });

    it('fills humans.txt with correct information', () => {
      assert.fileContent('humans.txt', /John Doe -- Creator -- johndoe@gmail.com/);
    });

    it('fills index.html with correct information', () => {
      assert.fileContent('index.html', /<title>John Doe Website<\/title>/);
      assert.fileContent('index.html', /<meta name="author" content="John Doe">/);
    });

    it('fills LICENSE.txt with correct information', () => {
      assert.fileContent('LICENSE.txt', /John Doe/);
    });

    it('fills README.md with correct information', () => {
      assert.fileContent('README.md', /# John Doe Website/);
    });
  });

  describe('not selecting babel', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          githubUser: 'johndoe',
          websiteName: 'John Doe Website',
          cssAssets: [ 'includeNormalizeCss' ],
          jsAssets: [ 'includeJquery' ]
        })
        .on('end', done);
    });

    it('should create gulpfile.js instead of gulpfile.babel.js', () => {
      assert.file('gulpfile.js');
      assert.noFile('gulpfile.babel.js');
    });
  });

  after(() => {
    mockery.disable();
  });
});
