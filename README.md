# LOL Explorer

## Requirment Server

- [Lol explorer api server](https://bitbucket.org/ysm1180/lol-explorer-server/src/master/)


## Building Development EXE
The typical workflow to get up running is as follows:

* Run `yarn install` to get all required dependencies on your machine.
* Run `yarn electron:build` to create a development build of the app.
* Run `yarn electron:serve` to launch the application. Changes will be compiled in the
  background. The app can then be reloaded to see the changes (<kbd>Ctrl/Command+Alt+R</kbd>).

If you've made changes in the `main-process` folder you need to run `yarn
build:dev` to rebuild the package, and then `yarn start` for these changes to be
reflected in the running app.


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
