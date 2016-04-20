import Ember from 'ember';
import layout from '../templates/components/x-xml-http-request';

import XRequest from 'x-request/x-request';

export default Ember.Component.extend({
  layout: layout,

  /**
   * The HTTP verb to use for this request.
   *
   * @property method
   * @type String
   * @default "POST"
   */
  'method': 'POST',

  /**
   * Defines the data type of the `response` property
   *
   * HTTP is a text protocol, and so all values transported over it
   * must be serialized and deserialized as text. The browser is
   * capable of parsing this text into a variety of formats including
   * XML and JSON.
   *
   * Use this property to indicate which format it
   * @property response-type
   * @type String
   * @default "json"
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
   */
  'response-type': 'json',

  /**
   * Indicate whether to send session cookies with this request.
   *
   * When authenticating with a server, by default `XMLHttpRequest`s
   * will not send any cookies, and authentication information is sent
   * with query params and/or headers.
   *
   * Set this property to `true` in order to send all cooikes back to
   * the server with each XMLHttpRequest
   *
   * @property with-credentials
   * @type Boolean
   * @default false
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
   */
  'with-credentials': false,

  /**
   * Timeout in milliseconds after which this request will be cancelled.
   *
   * @property timeout
   * @type Number
   * @default 0
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
   */
  'timeout': 0,

  /**
   * The URL to which this request is sent.
   *
   * This is the value that will be passed as the second argument to the `open`
   * method.
   *
   * @property url
   * @type String
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#open()
   */
  'url': '',

  /**
   * An object containing the HTTP headers that will be sent with this
   * request. E.g.
   *
   * {'Authorization': `Bearer ${token}`}
   *
   * @property headers
   * @type Object
   */
  'headers': Ember.computed(function() { return {}; }),

  /**
   * Used for testing and stubbing out the binding to the underlying
   * request library.
   *
   * @private
   */
  'request-constructor': XRequest,

  /**
   * A property on which the `request` depends. This property is
   * incremented in order to force a recompute of the request. Used
   * for the reset functionality.
   *
   * @private
   */
  'resetCount': 0,

  /**
   * The instance of `XRequest` that this component wraps.
   *
   * XRequest is the underlying reactive, plain-old-javascript library
   * that emits new states whenever the request changes. It is
   * responsible for creating the request and copying the headers. To
   * do anything with the request however, you need to invoke the
   * `send` action.
   *
   * @property request
   * @type XRequest
   * @see https://github.com/cowboyd/x-request.js
   */
  request: Ember.computed('method', 'response-type', 'with-credentials', 'url', 'headers', 'timeout', 'resetCount', function() {
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

  /**
   * Initialize the current state whenever the request object
   * changes.
   *
   * The `model` is computed off of the current state, but but the
   * current state is only set as part of the request callback
   * whenever the request *changes* state. This does not account for
   * when a brand new request is initialized and its state needs to be
   * recorded.
   *
   * As a result, we just copy over the request state every time we
   * detect a new request. This method is also invoked at element
   * insertion time.
   *
   * @method setInitialState
   * @private
   */
  setInitialState: Ember.observer('request', function() {
    this.set('currentRequestState', this.get('request.state'));
  }),

  /**
   * The actual object that is yielded into the containing block.
   *
   * In order to template a request, we need to yield the
   * state of the request so it can read properties like `upload` and
   * `isLoadStarted`. However, we also need to augment this state so
   * by "hanging"  actions on it that can invoke methods on the state
   * itself.
   *
   * This is accomplished by using `Object.create` to instantiate the
   * model with the XRequest state as its prototype. That way it will
   * contain all of the properties of the state, but the passed in
   * property descriptors can define actions that call back to the
   * component.
   *
   * @property model
   * @type XRequest.State
   */
  model: Ember.computed('currentRequestState', function() {
    let request = this.get('request');
    let config = this.getProperties('method', 'url');
    let state = this.get('currentRequestState') || this.get('request.state');
    let component = this;
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
      },
      reset: {
        value: function() {
          component.incrementProperty('resetCount');
        }
      }
    });
  }),

  didInsertElement(...args) {
    this._super(...args);
    this.setInitialState();
  }
});
