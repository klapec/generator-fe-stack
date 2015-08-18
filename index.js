import fs from 'fs-extra';
import { Base } from 'yeoman-generator';
import yosay from 'yosay';
import chalk from 'chalk';
import GithubApi from 'github';

import { paramCase, titleCase } from 'change-case';

const github = new GithubApi({
  version: '3.0.0'
});
let invalidUsername;

function hasFeature(answers, type, feature) {
  return answers && answers[type].indexOf(feature) !== -1;
}

export default class StaticGenerator extends Base {
  constructor(...args) {
    super(...args);
  }

  get prompting() {
    return {
      askForName() {
        const done = this.async();
        const prompts = [{
          name: 'githubUser',
          message: `What's your Github username? I'll use it to preconfigure some of the files`
        }];

        this.log(yosay('Hello! \n HTML5 Boilerplate is included by default.'));

        this.log(chalk.bold.yellow('General information'));

        this.prompt(prompts, answers => {
          this.githubUser = answers.githubUser;
          done();
        });
      },

      askForWebsiteName() {
        const done = this.async();
        const prompts = [{
          name: 'websiteName',
          message: `What's the name of your website?`
        }];

        this.prompt(prompts, props => {
          this.websiteName = titleCase(props.websiteName);
          this.websiteNameSlug = paramCase(props.websiteName);
          done();
        });
      },

      askForCssAssets() {
        const done = this.async();
        const prompts = [{
          type: 'checkbox',
          name: 'cssAssets',
          message: 'What would you like to install?',
          choices: [{
            name: `Normalize.css ${chalk.gray('(modern alternative to CSS resets)')}`,
            value: 'includeNormalizeCss',
            checked: true
          }, {
            name: `include-media ${chalk.gray('(Sass library for media queries)')}`,
            value: 'includeIncludeMedia',
            checked: false
          }, {
            name: `Animate.css ${chalk.gray('(CSS animations library)')}`,
            value: 'includeAnimateCss',
            checked: false
          }, {
            name: `Susy ${chalk.gray('(Responsive layout toolkit for Sass)')}`,
            value: 'includeSusy',
            checked: false
          }, {
            name: `Jeet ${chalk.gray('(A grid system for humans)')}`,
            value: 'includeJeet',
            checked: false
          }, {
            name: `Lost Grid ${chalk.gray('(Powerful grid system built in PostCSS)')}`,
            value: 'includeLostGrid',
            checked: false
          }, {
            name: `Bootstrap ${chalk.gray('(Popular front-end framework)')}`,
            value: 'includeBootstrap',
            checked: false
          }, {
            name: `Foundation ${chalk.gray('(Another popular front-end framework)')}`,
            value: 'includeFoundation',
            checked: false
          }, {
            name: `PureCSS ${chalk.gray('(A set of small, responsive CSS modules)')}`,
            value: 'includePureCss',
            checked: false
          }, {
            name: `Semantic UI ${chalk.gray('(UI framework designed for theming)')}`,
            value: 'includeSemanticUi',
            checked: false
          }]
        }];

        this.log(chalk.bold.yellow('CSS / Sass'));

        this.prompt(prompts, answers => {

          this.includeNormalizeCss = hasFeature(answers, 'cssAssets', 'includeNormalizeCss');
          this.includeIncludeMedia = hasFeature(answers, 'cssAssets', 'includeIncludeMedia');
          this.includeAnimateCss = hasFeature(answers, 'cssAssets', 'includeAnimateCss');
          this.includeSusy = hasFeature(answers, 'cssAssets', 'includeSusy');
          this.includeJeet = hasFeature(answers, 'cssAssets', 'includeJeet');
          this.includeLostGrid = hasFeature(answers, 'cssAssets', 'includeLostGrid');
          this.includeBootstrap = hasFeature(answers, 'cssAssets', 'includeBootstrap');
          this.includeFoundation = hasFeature(answers, 'cssAssets', 'includeFoundation');
          this.includePureCss = hasFeature(answers, 'cssAssets', 'includePureCss');
          this.includeSemanticUi = hasFeature(answers, 'cssAssets', 'includeSemanticUi');
          done();
        });
      },

      askForJsAssets() {
        const done = this.async();
        const prompts = [{
          type: 'checkbox',
          name: 'jsAssets',
          message: 'What would you like to install?',
          choices: [{
            name: `Babel ${chalk.gray('(JavaScript compiler for ES6 features)')}`,
            value: 'includeBabel',
            checked: true
          }, {
            name: `jQuery ${chalk.gray('(Popular JavaScript library)')} ${chalk.red('required by Bootstrap and Foundation')}`,
            value: 'includeJquery',
            checked: true
          }, {
            name: `lodash ${chalk.gray('(JavaScript utility library)')}`,
            value: 'includeLodash',
            checked: false
          }]
        }];

        this.log(chalk.bold.yellow('JavaScript'));

        this.prompt(prompts, answers => {

          this.includeJquery = hasFeature(answers, 'jsAssets', 'includeJquery');
          this.includeBabel = hasFeature(answers, 'jsAssets', 'includeBabel');
          this.includeLodash = hasFeature(answers, 'jsAssets', 'includeLodash');

          done();
        });
      }
    };
  }

  get configuring() {
    return {
      main() {
        const done = this.async();

        github.user.getFrom({
          user: this.githubUser
        }, (err, res) => {
          if (!res) {
            this.realName = this.user.git.name() || 'CHANGE_THIS';
            this.email = this.user.git.email() || 'CHANGE_THIS';

            this.user.github.username(null, (err, username) => {
              if (err) {
                invalidUsername = true;
              }
              this.nickName = username ? username : 'CHANGE_THIS';
              this.githubUrl = `https://github.com/${this.nickName}`;
              return done();
            });
          } else {
            this.nickName = res.login;
            this.realName = res.name;
            this.email = res.email;
            this.githubUrl = res.html_url;
            done();
          }
        });
      }
    };
  }

  get writing() {
    return {
      projectFiles() {
        if (this.includeBabel) {
          this.template('gulpfile.babel.js', 'gulpfile.babel.js');
        } else {
          this.template('gulpfile.js', 'gulpfile.js');
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

      h5bp() {
        this.template('index.html', 'index.html');

        this.copy('404.html', '404.html');
      },

      folders() {
        this.directory('dist', 'dist');
        this.directory('images', 'images');
        this.directory('sass', 'sass');
        this.directory('scripts', 'scripts');
        this.directory('test', 'test');
      }
    };
  }

  get install() {
    return {
      main() {
        this.installDependencies({
          bower: false,
          callback: () => {
            if (!this.options.skipInstall) {
              this.log(chalk.bold.green('Done.'));
              this.log(chalk.bold.yellow('Moving files'));
              if (this.includeNormalizeCss) {
                fs.copySync('node_modules/normalize.css/normalize.css', 'sass/vendors/_normalize.scss');
              }

              if (this.includeIncludeMedia) {
                fs.copySync('node_modules/include-media/dist/_include-media.scss', 'sass/vendors/_include-media.scss');
              }

              if (this.includeAnimateCss) {
                fs.copySync('node_modules/animate.css/animate.css', 'sass/vendors/_animate.scss');
              }

              if (this.includeSusy) {
                fs.copySync('node_modules/susy/sass', 'sass/vendors/susy');
              }

              if (this.includeJeet) {
                fs.copySync('node_modules/jeet/scss/jeet', 'sass/vendors/jeet');
              }

              if (this.includeBootstrap) {
                fs.copySync('node_modules/bootstrap-sass/assets/stylesheets', 'sass/vendors/bootstrap');
                fs.copySync('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js', 'dist/bootstrap.min.js');
                fs.copySync('node_modules/bootstrap-sass/assets/fonts/bootstrap', 'fonts');
              }

              if (this.includeFoundation) {
                fs.copySync('node_modules/foundation-sites/scss', 'sass/vendors/foundation');
                fs.copySync('node_modules/foundation-sites/js/foundation.min.js', 'dist/foundation.min.js');
              }

              if (this.includePureCss) {
                fs.copySync('node_modules/purecss/build/pure.css', 'sass/vendors/_pure.scss');
              }

              if (this.includeSemanticUi) {
                fs.copySync('node_modules/semantic-ui-css/semantic.css', 'sass/vendors/_semantic.scss');
                fs.copySync('node_modules/semantic-ui-css/semantic.js', 'scripts/vendors/semantic.js');
              }

              if (this.includeJquery) {
                fs.copySync('node_modules/jquery/dist/jquery.min.js', 'dist/jquery.min.js');
              }

              if (this.includeLodash) {
                fs.copySync('node_modules/lodash/index.js', 'scripts/vendors/lodash.js');
              }

              this.log(chalk.bold.green('Done.'));

              this.log(chalk.bold.yellow('Initializing git repository'));
              const git = this.spawnCommand('git', ['init']);
              git.on('close', () => {
                this.log(chalk.bold.green('Done.'));

                this.log(chalk.bold.yellow('Pre-building stylesheets and scripts'));
                const gulp = this.spawnCommand('gulp', ['build']);
                gulp.on('close', () => {
                  this.log(chalk.bold.green('Done.'));
                  if (invalidUsername) {
                    this.log(chalk.bold.red(`Couldn't find your Github username. Please edit package.json.`));
                  }
                  this.log(chalk.bold.green('All done! Enter "gulp" to start the server.'));
                });
              });
            }
          }
        });
      }
    };
  }
}
