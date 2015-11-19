/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'x-xml-http-request',
  'Integration: XXmlHttpRequestComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#x-xml-http-request}}
      //     template content
      //   {{/x-xml-http-request}}
      // `);

      this.render(hbs`{{x-xml-http-request}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
