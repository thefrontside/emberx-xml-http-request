# emberx-xml-http-request

Easily achieve beautiful, transparent uploads and downloads with a reactive XmlHttpRequest

`emberx-xml-http-request` is an ember binding to the [x-request library][1]

It allows you to declaratively make xml http requests in your
templates, so that you can track both their upload and download
progress. To use it, just drop it into your template like so:

```handlebars
{{x-xml-http-request method="PUT" url=http://fileupload.com data=file as |xhr|}}
  name: {{file.name}}<br/>
  bytes uploaded: {{xhr.upload.loaded}} <br/>
  bytes total: {{xhr.upload.total}} <br/>
  percentage complete: {{xhr.upload.percentage}}
{{/x-xml-http-request}}
```

All of the properties of the the `xhr` param, including `readyState`,
`status`, `response`, `responseText`, etc... are reactive
and can be bound to in templates, and can also be used as the input
for other computed properties.

This is particularly useful in tracking the progress of an upload or a
download.

Because `xhr` radiates all information about its progress, building
UIs to track it are a snap.

For more details on which properties are available see the
documentation for [x-request][1]

## Installation

```
ember install emberx-xml-http-request
```

[1]: https://github.com/cowboyd/x-request.js


## Code of Conduct
Please note that this project is released with a Contributor Code of
Conduct. By participating in this project you agree to abide by its
terms, which can be found in the `CODE_OF_CONDUCT.md` file in this
repository.
