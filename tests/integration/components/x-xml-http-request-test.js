/* jshint expr:true */
import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'x-xml-http-request',
  'Integration: XmlHttpRequestComponent',
  {
    integration: true
  },
  function() {
    beforeEach(function() {
      let test = this;

      function XRequestStub(options) {
        test.stub = this;
        this.options = options;
        this.setRequestHeader = sinon.spy();
        this.send = sinon.spy();
        this.open = sinon.spy();
        this.abort = sinon.spy();
        this.state = {};
      }

      this.set('XRequestStub', XRequestStub);
      this.set('headers', {one: "two"});
      this.set('method', 'POST');
      this.set('data', {hello: 'I am data'});
      this.set('onInit', sinon.spy());
      this.render(hbs`
{{#x-xml-http-request headers=headers on-init=onInit response-type="json" method="POST" url="http://google.com" with-credentials=true timeout=1200 request-constructor=XRequestStub as |xhr|}}
  <div class="spec-status {{if xhr.isLoadStarted 'load-started'}}">Status</div>
  <button class="spec-send" {{action (action xhr.send data)}}>Send</button>
  <button class="spec-abort" {{action xhr.abort}}>Abort</button>
  <button class="spec-reset" {{action xhr.reset}}>Reset</button>
{{/x-xml-http-request}}`);
    });

    it("invokes the on-init action", function() {
      expect(this.get('onInit').called).to.equal(true);
      expect(this.get('onInit').firstCall).to.have.deep.property("args[0].send");
    });

    it('invokes the x-request constructor', function() {
      expect(this.stub.options).to.contain({
        freeze: false,
        withCredentials: true,
        timeout: 1200,
        responseType: "json"
      });
    });
    it("sets the headers of the request object", function() {
      expect(this.stub.setRequestHeader.calledWith('one', 'two')).to.equal(true);
    });

    describe("invoking the send() action", function() {
      beforeEach(function() {
        this.$('.spec-send').click();
      });
      it("call the open method with the configured http verb and url, and then calls the send method", function() {
        expect(this.stub.open.calledWith('POST', "http://google.com")).to.equal(true);
        expect(this.stub.send.calledWith({hello: 'I am data'})).to.equal(true);
      });
    });

    describe("invoking the abort action", function() {
      beforeEach(function() {
        this.$('.spec-abort').click();
      });

      it("calls the abort method on the underlying request object", function() {
        expect(this.stub.abort.called).to.equal(true);
      });
    });

    describe("emitting a new state", function() {
      beforeEach(function() {
        this.stub.options.observe({
          isLoadStarted: true
        });
      });
      it("is reflected in the scope of the component", function() {
        expect(this.$('.spec-status').hasClass('load-started')).to.equal(true);
      });
    });

    describe("resetting the request", function() {
      beforeEach(function() {
        this.previousStub = this.stub;
        this.$('.spec-reset').click();
      });
      it("generates a brand new request", function() {
        expect(this.stub).not.to.equal(this.previousStub);
      });
    });

  }
);
