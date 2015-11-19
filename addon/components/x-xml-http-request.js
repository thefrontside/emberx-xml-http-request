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

  generateRequest: Ember.observer('method', 'response-type', 'with-credentials', 'url', 'data', function() {
    console.log('generateReqquest');
    this.request = new XRequest({
      freeze: false,
      responseType: this.get('response-type'),
      withCredentials: this.get('with-credentials'),
      timeout: this.get('timeout'),
      observe: Ember.run.bind(this, function(state) {
        this.set('model', state);
      })
    });
    this.request.open(this.get('method'), this.get('url'));
    this.request.send(this.get('data'));
    this.set('model', this.request.state);
  }),

  didInitAttrs() {
    this.generateRequest();
  }
});
