import Ember from 'ember';
import layout from '../templates/components/x-xml-http-request';

import XRequest from 'x-request/x-request';

export default Ember.Component.extend({
  layout: layout,

  'data': '',
  'method': 'POST',
  'response-type': 'json',
  'with-credentials': false,
  'timeout': 0,
  'url': '',
  'headers': Ember.computed(function() { return {}; }),

  request: Ember.computed('method', 'response-type', 'with-credentials', 'url', 'headers', 'timeout', function() {
    let request = new XRequest({
      freeze: false,
      responseType: this.get('response-type'),
      withCredentials: this.get('with-credentials'),
      timeout: this.get('timeout'),
      observe: Ember.run.bind(this, function(state) {
        this.set('currentState', state);
      })
    });
    let headers = this.get('headers') || {};
    Object.keys(headers).forEach((key)=> {
      request.setRequestHeader(key, headers[key]);
    });
    return request;
  }),

  setInitialState: Ember.observer('request', function() {
    this.set('currentState', this.get('request.state'));
  }),

  model: Ember.computed('currentState', function() {
    let request = this.get('request');
    let config = this.getProperties('method', 'url');
    return Object.create(this.get('currentState'), {
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
