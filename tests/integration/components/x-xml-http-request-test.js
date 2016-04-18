/* jshint expr:true */
import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import {  beforeEach, it } from 'mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'x-xml-http-request',
  'Integration: XXmlHttpRequestComponent',
  {
    integration: true
  },
  function() {
    beforeEach(function() {
      let test = this;

      function XRequestStub(options) {
        test.stub = this;
        this.options = options;
        this.state = {};
        this.headers = {};
      }
      XRequestStub.prototype.setRequestHeader = function setRequestHeader(key, value) {
        this.headers[key] = value;
      };

      this.set('XRequestStub', XRequestStub);
      this.set('method', 'POST');
      this.render(hbs`
{{#x-xml-http-request headers=(hash one="two") response-type="json" method="POST" url="http://google.com" with-credentials=true timeout=1200 request-constructor=XRequestStub as |xhr|}}
  <button {{action xhr.send}}>Send</button>
  <button {{action xhr.abort}}>Abort</button>
{{/x-xml-http-request}}`);

    });

    it('invokes the x-request constructor', function() {
      expect(this.stub.options).to.contain({
        freeze: false,
        withCredentials: true,
        timeout: 1200,
        responseType: "json"
      });
    });
  }
);
