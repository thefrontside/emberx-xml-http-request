# emberx-xml-http-request

[![npm version](https://badge.fury.io/js/emberx-xml-http-request.svg)](https://badge.fury.io/js/emberx-xml-http-request)
[![Build Status](https://travis-ci.org/thefrontside/emberx-xml-http-request.svg?branch=master)](https://travis-ci.org/thefrontside/emberx-xml-http-request)

Easily achieve beautiful, transparent uploads and downloads with a reactive XmlHttpRequest

`emberx-xml-http-request` is an ember binding to the [x-request library][1]

It allows you to declaratively make xml http requests in your
templates by injecting an object modelling the request into your templates.

```handlebars
{{x-xml-http-request method="PUT" timeout=12000 url="http://fileupload.com" as |xhr|}}
  name: {{file.name}}<br/>
  bytes uploaded: {{xhr.upload.loaded}} <br/>
  bytes total: {{xhr.upload.total}} <br/>
  percentage complete: {{xhr.upload.percentage}}

  <button {{action (action xhr.send file)}}>Send</button>
  <button {{action (action xhr.abort)}}>Abort</button>

{{/x-xml-http-request}}
```

## Actions

In order to get the XHR to _do_ stuff, you'll need to invoke actions
on it. These actions are just JavaScript functions that are attached
to the object yielded into the template.

### send(data: String | Blob | ArrayBufferView | FormData)

Use this action to initiate the request and start transferring
bytes. The optional `data` parameter will be used as the body of the
request.  E.g.

``` handlebars
{{! send a string}}
<button {{action (action xhr.send "Hello World")}}>Say Hello To Server</button>

{{! send a file}}
<button {{action (action xhr.send file)}}>Send File</button>

{{! etc...}}
```
See [XMLHttpRequest#send()][2] for more about the valid types for data.


### abort()

Cancel the current request.

``` handlebars
<button {{action (action xhr.abort)}}>Cancel</button>
```


### reset()

Recreate the request entirely and start from scratch. This is useful
if you have aborted a request, or it times out, and you want to send
it again, but nothing else about the request has changed.

``` handlebars
<button {{action (pipe xhr.reset (action xhr.send file))}}>Retry</button>
```

## State

All of the properties of the the `xhr` param, including `readyState`,
`status`, `response`, `responseText`, etc... are reactive
and can be bound to in templates, and can also be used as the input
for other computed properties.

``` javascript
{
  readyState: 0,
  requestHeaders: {},
  responseHeaders: {},
  responseType: 'json'
  response: '',
  responseText: '',
  responseXML: '',
  isLoadStarted: false, // alias for download.isLoadStarted
  isLoadEnded: false,   // alias for download.isLoadEnded
  isAborted: false,     // alias for download.isAborted
  isErrored: false,     // alias for download.isErrored
  isTimedOut: false,    // alias for download.isTimedOut
  download: {
    isLoadStarted: false,
    isLoadEnded: false,
    isAborted: false,
    isErrored: false,
    isLengthComputable: false,
    total: 0,
    loaded: 0,
    ratio: 0,
    percentage: 0
  },
  upload: {
    isLoadStarted: false,
    isLoadEnded: false,
    isAborted: false,
    isErrored: false,
    isLengthComputable: false,
    total: 0,
    loaded: 0,
    ratio: 0,
    percentage: 0
  }
}
```

This is particularly useful in tracking the progress of an upload or a
download.

Because `xhr` radiates all information about its progress, building
UIs to track it are a snap.

## Installation

```
ember install emberx-xml-http-request
```

[1]: https://github.com/cowboyd/x-request.js
[2]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#send()

## Code of Conduct
Please note that this project is released with a Contributor Code of
Conduct. By participating in this project you agree to abide by its
terms, which can be found in the `CODE_OF_CONDUCT.md` file in this
repository.
