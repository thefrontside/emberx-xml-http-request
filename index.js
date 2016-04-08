/* jshint node: true */
'use strict';

var BabelTranspiler = require('broccoli-babel-transpiler');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var path = require('path');

module.exports = {
  name: 'emberx-xml-http-request',

  isDevelopingAddon: function() {
    return true;
  },

  /**
   * The addon tree is augmented with the x-request modules. This
   * makes them available not only to `ember-x-request` as a whole,
   * but also to the application if they want to embed it. It'll look
   * like:
   *    x-request/x-request.js
   *    x-request/progress.js
   */
  treeForAddon: function() {
    // get the base addon tree
    var addonTree = this._super.treeForAddon.apply(this, arguments);


    // transpile the x-request sources into ES5. However, we want
    // to leave the ES6 module declaration in place because they'll be
    // handled later by ember-cli.

    var src = path.join(require.resolve('x-request'), '../../src');

    var transpiled = new BabelTranspiler(src, {
      loose: true,
      blacklist: ['es6.modules']
    });

    // take the transpiled x-request sources and put them into
    // `modules/x-request/{*}.js` so that the
    // ember-cli build will pick them up.
    var xRequest = new Funnel(transpiled, {
      destDir: 'modules/x-request'
    });

    return new MergeTrees([addonTree, xRequest]);
  }
};
