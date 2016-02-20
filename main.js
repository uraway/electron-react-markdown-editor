/* eslint strict: 0 */
'use strict';

const fs = require('fs');

function getFileContent(file) {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      dialog.showErrorBox('Error', err);
    }

    mainWindow.send('fileContent', data);
  });
}

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
let menu;
let template;
let mainWindow = null;

crashReporter.start();

/*
const HATENA_CNSUMER = require('./config');
const OAuthHatena = require('electron-authentication-hatena');

const hatena = new OAuthHatena({
  key: HATENA_CNSUMER.key,
  secret: HATENA_CNSUMER.secret,
  scopes: ['read_public', 'write_public', 'read_private', 'write_private'],
});

ipcMain.on('hatenaOAuth', () => {
  var accessToken;
  var accessTokenSecret;
  if (!accessToken) {
    hatena.startRequest().then((result) => {
      accessToken = result.accessToken;
      accessTokenSecret = result.accessTokenSecret;
      console.log(accessToken, accessTokenSecret);

      ipcMain.send('hatenaPost', (accessToken, accessTokenSecret));
    }).catch((error) => {
      console.error(error, error.stack);
      dialog('Status', error);
    });
  } else {
    ipcMain.send('hatenaPost', (accessToken, accessTokenSecret));
  }
});
*/
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1024, height: 728 });

  if (process.env.HOT) {
    mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/app.html`);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  if (process.platform === 'darwin') {
    template = [{
      label: 'Electron',
      submenu: [{
        label: 'About ElectronReact',
        selector: 'orderFrontStandardAboutPanel:',
      }, {
        type: 'separator',
      }, {
        label: 'Services',
        submenu: [],
      }, {
        type: 'separator',
      }, {
        label: 'Hide ElectronReact',
        accelerator: 'Command+H',
        selector: 'hide:',
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:',
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:',
      }, {
        type: 'separator',
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        },
      },
    ],
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:',
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:',
      }, {
        type: 'separator',
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:',
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:',
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:',
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:',
      },
    ],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click: () => {
            dialog.showOpenDialog({
              title: 'Open your markdown file',
              properties: ['openFile'],
              filters: [{ name: 'Markdown', extensions: ['md'] }],
            }, fileName => {
              if (fileName) {
                getFileContent(fileName[0]);
              }
            });
          },
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click: () => {
            dialog.showSaveDialog({
              title: 'Save markdown file',
              filters: [{ name: 'Markdown', extensions: ['md'] }],
            }, fileName => {
              if (fileName === undefined) return;
              mainWindow.send('saveFile');
              ipcMain.on('contentToSave', (event, content) => {
                fs.writeFile(fileName, content, (err) => {
                  if (err === undefined) {
                    dialog.showMessageBox({ title: 'ファイルの保存', type: 'info', message: 'ファイルの保存が終了しました', buttons: ['OK'] });
                  } else {
                    dialog.showErrorBox('File Save Error', err);
                  }
                });
              });
            });
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.restart();
        },
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        },
      },
    ] : [
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
    ],
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:',
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:',
      }, {
        type: 'separator',
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:',
      },
    ],
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io');
        },
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        },
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        },
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues');
        },
      },
    ],
    },
  ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O',
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        },
      },
    ],
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.restart();
        },
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        },
      },
    ] : [
      {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
    ],
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io');
        },
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        },
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        },
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues');
        },
      },
    ],
    },
  ];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});

const blog = require('hatena-blog-api');
const moment = require('moment');

ipcMain.on('hatenaPostWsse', (event, title, content, hatenaUsername, hatenaBlogId, hatenaApikey, category, draftStatus) => {
  var client = blog({
    type: 'wsse',
    username: hatenaUsername,
    blogId: hatenaBlogId,
    apikey: hatenaApikey,
  });

  var options = {
    title: title,
    content: content,
    updated: moment().format('YYYY-MM-DDTHH:mm:ss'),
    categories: ['hatena'],
    draft: draftStatus,
  };

  client.create(options, (err, res) => {
    if (err) {
      console.error(err);
      mainWindow.send('Error', event, err);
    } else {
      let url = res.entry.link[1].$.href;
      console.log(url);
      mainWindow.send('Response', url);
    }
  });
});
