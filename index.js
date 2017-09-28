/* eslint-env node */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'emberx-xml-http-request',

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

    // take the x-request sources and put them into
    // `x-request/{*}.js` so that ember-cli-babel will
    // properly name them
    var src = path.join(require.resolve('x-request'), '../../src');
    var xRequest = new Funnel(src, {
      destDir: 'x-request'
    });

    // transpile the x-request sources into whatever the consuming app wants
    var babelAddon = this.addons.find(addon => addon.name === 'ember-cli-babel');
    var transpiled = babelAddon.transpileTree(xRequest);

    // add the transpiled sources to the add-on output
    return mergeTrees([addonTree, transpiled]);
  }
};
