import Ember from 'ember';
import layout from '../templates/components/x-xml-http-request';

import XRequest from 'x-request/x-request';

export default Ember.Component.extend({
  layout: layout,

  'method': 'POST',
  'response-type': 'json',
  'with-credentials': false,
  'timeout': 0,
  'url': '',
  'headers': Ember.computed(function() { return {}; }),

  'request-constructor': XRequest,

  request: Ember.computed('method', 'response-type', 'with-credentials', 'url', 'headers', 'timeout', function() {
    let Request = this.get('request-constructor');

    let request = new Request({
      freeze: false,
      responseType: this.get('response-type'),
      withCredentials: this.get('with-credentials'),
      timeout: this.get('timeout'),
      observe: Ember.run.bind(this, function(state) {
        this.set('currentRequestState', state);
      })
    });
    let headers = this.get('headers') || {};
    Object.keys(headers).forEach((key)=> {
      request.setRequestHeader(key, headers[key]);
    });
    return request;
  }),

  setInitialState: Ember.observer('request', function() {
    this.set('currentRequestState', this.get('request.state'));
  }),

  model: Ember.computed('currentRequestState', function() {
    let request = this.get('request');
    let config = this.getProperties('method', 'url');
    let state = this.get('currentRequestState') || this.get('request.state');
    return Object.create(state, {
      send: {
        value: function(data) {
          request.open(config.method, config.url);
          request.send(data);
        }
      },
      abort: {
        value:  function() {
          request.abort();
        }
      }
    });
  }),

  didInsertElement(...args) {
    this._super(...args);
    this.setInitialState();
  }
});
