# flatiron-express

** Support dropped since flatiron seems to be dead**

Ever wanted to use `flatiron` with its awesome plugin features and
configuration integration but get rid of this crappy `director` thing and use
`express`?  This is what `flatiron-express` does.  It integrates `express` into
your flatiron application to replace `director` as router.

## Usage

To include the `express` plugin use the following code to integrate it.

```js
var flatiron = require('flatiron'),
    flatironExpress = require('flatiron-express'),
    app = flatiron.app;
app.use(flatironExpress);
```

Now you can start using `express` like this:

```js
app.get('/', function (req, res) {
  ...
});
...
```

All the verbs you know from `express` are just provided to you through the
application object.

Another feature is the `use()` proxy.  `flatiron-express` replaces `flatiron`'s
`use()` method with a proxy to make it easy to use `express` middleware.
Here's an example:

```js
var express = app.express;

/* First we use some flatiron plugins as proof of concept. */

app.use(require('resourceful'));

...

/* And then we use ordinary express middleware.  So the following should be
 * pretty familiar to you. */

app
  .use(express.bodyParser())
  .use(express.session('keyboard cat'));

/* Finally we spawn the http server to hit express to action.  (I never
 * understood why flatiron's http does this ugly app.start thing) */

require('http').createServer(app.router).listen(8080);
```

Pretty straight forward.

## API

### Options

Options are supplied when attaching the plugin to the application:

```js
...
app.use(require('flatiron-express'), {

  /* Options ... */

});
...
```

The following options are provided:

 * `instance` - With this option you can supply a self-instantiated express
   instance which is then used.

### Properties

In the following I describe the properties which are attached to the
application object.

### `.router`

This property holds the instantiated express instance.

### `.use()`

Replaces the traditional use method with a proxy which can handle both
`express` middleware and `flatiron` plugins.

### `.[VERB]()`

All verbs provided by express.  For the usage refer to the `express`
documentation.
