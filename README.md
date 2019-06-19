# LOL EXPLORER

## Requirment

- [Lol explorer api server](https://bitbucket.org/ysm1180/lol-explorer-server/src/master/)

# OS
- Windows

## Development Requirement Tools

- Yarn

## Building Development EXE
The typical workflow to get up running is as follows:

* Run `yarn` to get all required dependencies on your machine.
* Run `yarn build:dev` to create a development build of the app.
* Run `yarn start` to launch the application. Changes will be compiled in the
  background. The app can then be reloaded to see the changes (<kbd>Ctrl/Command+Alt+R</kbd>).

If you've made changes in the `main-process` folder you need to run `yarn
build:dev` to rebuild the package, and then `yarn start` for these changes to be
reflected in the running app.

## Debugging

Electron ships with Chrome Dev Tools to assist with debugging, profiling and
other measurement tools.

1. Run the command `yarn start` to launch the app.
2. Under the **View** menu, select **Toggle Developer Tools**.

When running the app in development mode,
[React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
should automatically install itself on first start when in development mode.