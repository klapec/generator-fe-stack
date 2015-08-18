'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _yeomanGenerator = require('yeoman-generator');

var _yosay = require('yosay');

var _yosay2 = _interopRequireDefault(_yosay);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _changeCase = require('change-case');

var github = new _github2['default']({
  version: '3.0.0'
});
var invalidUsername = undefined;

function hasFeature(answers, type, feature) {
  return answers && answers[type].indexOf(feature) !== -1;
}

var StaticGenerator = (function (_Base) {
  _inherits(StaticGenerator, _Base);

  function StaticGenerator() {
    _classCallCheck(this, StaticGenerator);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(StaticGenerator.prototype), 'constructor', this).apply(this, args);
  }

  _createClass(StaticGenerator, [{
    key: 'prompting',
    get: function get() {
      return {
        askForName: function askForName() {
          var _this = this;

          var done = this.async();
          var prompts = [{
            name: 'githubUser',
            message: 'What\'s your Github username? I\'ll use it to preconfigure some of the files'
          }];

          this.log((0, _yosay2['default'])('Hello! \n HTML5 Boilerplate is included by default.'));

          this.log(_chalk2['default'].bold.yellow('General information'));

          this.prompt(prompts, function (answers) {
            _this.githubUser = answers.githubUser;
            done();
          });
        },

        askForWebsiteName: function askForWebsiteName() {
          var _this2 = this;

          var done = this.async();
          var prompts = [{
            name: 'websiteName',
            message: 'What\'s the name of your website?'
          }];

          this.prompt(prompts, function (props) {
            _this2.websiteName = (0, _changeCase.titleCase)(props.websiteName);
            _this2.websiteNameSlug = (0, _changeCase.paramCase)(props.websiteName);
            done();
          });
        },

        askForCssAssets: function askForCssAssets() {
          var _this3 = this;

          var done = this.async();
          var prompts = [{
            type: 'checkbox',
            name: 'cssAssets',
            message: 'What would you like to install?',
            choices: [{
              name: 'Normalize.css ' + _chalk2['default'].gray('(modern alternative to CSS resets)'),
              value: 'includeNormalizeCss',
              checked: true
            }, {
              name: 'include-media ' + _chalk2['default'].gray('(Sass library for media queries)'),
              value: 'includeIncludeMedia',
              checked: false
            }, {
              name: 'Animate.css ' + _chalk2['default'].gray('(CSS animations library)'),
              value: 'includeAnimateCss',
              checked: false
            }, {
              name: 'Susy ' + _chalk2['default'].gray('(Responsive layout toolkit for Sass)'),
              value: 'includeSusy',
              checked: false
            }, {
              name: 'Jeet ' + _chalk2['default'].gray('(A grid system for humans)'),
              value: 'includeJeet',
              checked: false
            }, {
              name: 'Bootstrap ' + _chalk2['default'].gray('(Popular front-end framework)'),
              value: 'includeBootstrap',
              checked: false
            }, {
              name: 'Foundation ' + _chalk2['default'].gray('(Another popular front-end framework)'),
              value: 'includeFoundation',
              checked: false
            }, {
              name: 'PureCSS ' + _chalk2['default'].gray('(A set of small, responsive CSS modules)'),
              value: 'includePureCss',
              checked: false
            }, {
              name: 'Semantic UI ' + _chalk2['default'].gray('(UI framework designed for theming)'),
              value: 'includeSemanticUi',
              checked: false
            }]
          }];

          this.log(_chalk2['default'].bold.yellow('CSS / Sass'));

          this.prompt(prompts, function (answers) {

            _this3.includeNormalizeCss = hasFeature(answers, 'cssAssets', 'includeNormalizeCss');
            _this3.includeIncludeMedia = hasFeature(answers, 'cssAssets', 'includeIncludeMedia');
            _this3.includeAnimateCss = hasFeature(answers, 'cssAssets', 'includeAnimateCss');
            _this3.includeSusy = hasFeature(answers, 'cssAssets', 'includeSusy');
            _this3.includeJeet = hasFeature(answers, 'cssAssets', 'includeJeet');
            _this3.includeBootstrap = hasFeature(answers, 'cssAssets', 'includeBootstrap');
            _this3.includeFoundation = hasFeature(answers, 'cssAssets', 'includeFoundation');
            _this3.includePureCss = hasFeature(answers, 'cssAssets', 'includePureCss');
            _this3.includeSemanticUi = hasFeature(answers, 'cssAssets', 'includeSemanticUi');
            done();
          });
        },

        askForJsAssets: function askForJsAssets() {
          var _this4 = this;

          var done = this.async();
          var prompts = [{
            type: 'checkbox',
            name: 'jsAssets',
            message: 'What would you like to install?',
            choices: [{
              name: 'Babel ' + _chalk2['default'].gray('(JavaScript compiler for ES6 features)'),
              value: 'includeBabel',
              checked: true
            }, {
              name: 'jQuery ' + _chalk2['default'].gray('(Popular JavaScript library)') + ' ' + _chalk2['default'].red('required by Bootstrap and Foundation'),
              value: 'includeJquery',
              checked: true
            }, {
              name: 'lodash ' + _chalk2['default'].gray('(JavaScript utility library)'),
              value: 'includeLodash',
              checked: false
            }]
          }];

          this.log(_chalk2['default'].bold.yellow('JavaScript'));

          this.prompt(prompts, function (answers) {

            _this4.includeJquery = hasFeature(answers, 'jsAssets', 'includeJquery');
            _this4.includeBabel = hasFeature(answers, 'jsAssets', 'includeBabel');
            _this4.includeLodash = hasFeature(answers, 'jsAssets', 'includeLodash');

            done();
          });
        }
      };
    }
  }, {
    key: 'configuring',
    get: function get() {
      return {
        main: function main() {
          var _this5 = this;

          var done = this.async();

          github.user.getFrom({
            user: this.githubUser
          }, function (err, res) {
            if (!res) {
              _this5.realName = _this5.user.git.name() || 'CHANGE_THIS';
              _this5.email = _this5.user.git.email() || 'CHANGE_THIS';

              _this5.user.github.username(null, function (err, username) {
                if (err) {
                  invalidUsername = true;
                }
                _this5.nickName = username ? username : 'CHANGE_THIS';
                _this5.githubUrl = 'https://github.com/' + _this5.nickName;
                return done();
              });
            } else {
              _this5.nickName = res.login;
              _this5.realName = res.name;
              _this5.email = res.email;
              _this5.githubUrl = res.html_url;
              done();
            }
          });
        }
      };
    }
  }, {
    key: 'writing',
    get: function get() {
      return {
        projectFiles: function projectFiles() {
          if (this.includeBabel) {
            this.copy('gulpfile.babel.js', 'gulpfile.babel.js');
          } else {
            this.copy('gulpfile.js', 'gulpfile.js');
          }

          this.template('_package.json', 'package.json');
          this.template('humans.txt', 'humans.txt');
          this.template('LICENSE.txt', 'LICENSE.txt');
          this.template('README.md', 'README.md');

          this.copy('.npmignore', '.gitignore');
          this.copy('.tern-project', '.tern-project');
          this.copy('browserconfig.xml', 'browserconfig.xml');
          this.copy('crossdomain.xml', 'crossdomain.xml');
          this.copy('favicon.ico', 'favicon.ico');
          this.copy('robots.txt', 'robots.txt');
        },

        h5bp: function h5bp() {
          this.template('index.html', 'index.html');

          this.copy('404.html', '404.html');
        },

        folders: function folders() {
          this.directory('dist', 'dist');
          this.directory('images', 'images');
          this.directory('sass', 'sass');
          this.directory('scripts', 'scripts');
          this.directory('test', 'test');
        }
      };
    }
  }, {
    key: 'install',
    get: function get() {
      return {
        main: function main() {
          var _this6 = this;

          this.installDependencies({
            bower: false,
            callback: function callback() {
              if (!_this6.options.skipInstall) {
                _this6.log(_chalk2['default'].bold.green('Done.'));
                _this6.log(_chalk2['default'].bold.yellow('Moving files'));
                if (_this6.includeNormalizeCss) {
                  _fsExtra2['default'].copySync('node_modules/normalize.css/normalize.css', 'sass/vendors/_normalize.scss');
                }

                if (_this6.includeIncludeMedia) {
                  _fsExtra2['default'].copySync('node_modules/include-media/dist/_include-media.scss', 'sass/vendors/_include-media.scss');
                }

                if (_this6.includeAnimateCss) {
                  _fsExtra2['default'].copySync('node_modules/animate.css/animate.css', 'sass/vendors/_animate.scss');
                }

                if (_this6.includeSusy) {
                  _fsExtra2['default'].copySync('node_modules/susy/sass', 'sass/vendors/susy');
                }

                if (_this6.includeJeet) {
                  _fsExtra2['default'].copySync('node_modules/jeet/scss/jeet', 'sass/vendors/jeet');
                }

                if (_this6.includeBootstrap) {
                  _fsExtra2['default'].copySync('node_modules/bootstrap-sass/assets/stylesheets', 'sass/vendors/bootstrap');
                  _fsExtra2['default'].copySync('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js', 'dist/bootstrap.min.js');
                  _fsExtra2['default'].copySync('node_modules/bootstrap-sass/assets/fonts/bootstrap', 'fonts');
                }

                if (_this6.includeFoundation) {
                  _fsExtra2['default'].copySync('node_modules/foundation-sites/scss', 'sass/vendors/foundation');
                  _fsExtra2['default'].copySync('node_modules/foundation-sites/js/foundation.min.js', 'dist/foundation.min.js');
                }

                if (_this6.includePureCss) {
                  _fsExtra2['default'].copySync('node_modules/purecss/build/pure.css', 'sass/vendors/_pure.scss');
                }

                if (_this6.includeSemanticUi) {
                  _fsExtra2['default'].copySync('node_modules/semantic-ui-css/semantic.css', 'sass/vendors/_semantic.scss');
                  _fsExtra2['default'].copySync('node_modules/semantic-ui-css/semantic.js', 'scripts/vendors/semantic.js');
                }

                if (_this6.includeJquery) {
                  _fsExtra2['default'].copySync('node_modules/jquery/dist/jquery.min.js', 'dist/jquery.min.js');
                }

                if (_this6.includeLodash) {
                  _fsExtra2['default'].copySync('node_modules/lodash/index.js', 'scripts/vendors/lodash.js');
                }

                _this6.log(_chalk2['default'].bold.green('Done.'));

                _this6.log(_chalk2['default'].bold.yellow('Initializing git repository'));
                var git = _this6.spawnCommand('git', ['init']);
                git.on('close', function () {
                  _this6.log(_chalk2['default'].bold.green('Done.'));

                  _this6.log(_chalk2['default'].bold.yellow('Pre-building stylesheets and scripts'));
                  var gulp = _this6.spawnCommand('gulp', ['build']);
                  gulp.on('close', function () {
                    _this6.log(_chalk2['default'].bold.green('Done.'));
                    if (invalidUsername) {
                      _this6.log(_chalk2['default'].bold.red('Couldn\'t find your Github username. Please edit package.json.'));
                    }
                    _this6.log(_chalk2['default'].bold.green('All done! Enter "gulp" to start the server.'));
                  });
                });
              }
            }
          });
        }
      };
    }
  }]);

  return StaticGenerator;
})(_yeomanGenerator.Base);

exports['default'] = StaticGenerator;
module.exports = exports['default'];