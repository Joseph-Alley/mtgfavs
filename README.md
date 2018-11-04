# mtgfavs

This is a simple test application I built, to experiment with Marionette.js, and also to play with the MtG SDK.

The front-end code is inside the /src directory. (which webpack then builds into the /src directory) The back-end node/express code is headed in server.js, but is also distributed between the /models, /controllers, and /routes directories.

To install:

```npm install```

To run the application:

```node server.js```

If you make any changes to the front-end code, you'll need to use webpack to repackage it. You can do this with the following command:

```npm run build```
