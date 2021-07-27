import { app, BrowserWindow, nativeTheme, shell } from 'electron';
import * as fs from 'fs';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import * as path from 'path';
try {
  if (
    process.platform === 'win32' &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    titleBarStyle: 'hiddenInset',
    useContentSize: true,
    webPreferences: {
      devTools: !process.env.PROD,
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      // we enable contextIsolation (Electron 12+ has it enabled by default anyway)
      contextIsolation: true,
      // we use a new way to reference the preload script
      // (it's going to be needed, so add it and create the file if it's not there already)
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    },
  });

  mainWindow.loadURL(process.env.APP_URL).catch((e) => console.log(e));

  const handleRedirect = (e, url) => {
    if (url.includes('//mirai-api.herokuapp.com/auth')) {
      console.log('nice, auth in progress');
      console.log(url);
      e.preventDefault();
      var authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        'node-integration': false,
        'web-security': false,
      });
      // This is just an example url - follow the guide for whatever service you are using

      // 'will-navigate' is an event emitted when the window.location changes
      // newUrl should contain the tokens you need
      authWindow.webContents.on('will-navigate', function (event, newUrl) {
        console.log(newUrl);
        if (newUrl.includes('localhost')) {
          authWindow.close();
          mainWindow.loadURL(newUrl);
        }
        // More complex code to handle tokens goes here
      });
      authWindow.loadURL(url);
      authWindow.show();

      authWindow.on('closed', function () {
        authWindow = null;
      });
      return;
    }
    if (url != mainWindow.webContents.getURL()) {
      if (!url.includes('localhost')) {
        e.preventDefault();
        shell.openExternal(url);
      }
    }
  };

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
app.whenReady().then(() => {
  installExtension(VUEJS3_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
});
