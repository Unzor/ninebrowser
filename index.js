var express = require('express');
var appey = express();

appey.use(express.json());

const cors = require('cors');



appey.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
appey.get('/searchbar', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
appey.get('/', function(req, res) {
    res.send(`<h3> Welcome to NineBrowser! </h3>
<p> Use the navigation bar to browse to your favorite pages.</p>`);
})
const {
    app,
    remote,
    BrowserWindow,
    BrowserView,
    screen,
    Menu,
    globalShortcut
} = require('electron');

Menu.setApplicationMenu(null)

function createWindow() {
    const win = new BrowserWindow({
        title: "NineBrowser",
        icon: "nb.png",
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadURL('http://localhost:8080/searchbar');

    global.view = new BrowserView();
    win.setBrowserView(view);
    setInterval(function() {
        view.setBounds({
            x: 0,
            y: 33,
            width: screen.getPrimaryDisplay().size.width,
            height: screen.getPrimaryDisplay().size.height
        })
    }, 10);
    view.webContents.loadURL('http://localhost:8080/');
    appey.get('/zip', function(req, res){
  req.sendFile('multibrowser/ninebrowser.zip');
})
    appey.post('/api/browse', function(req, res) {
        view.webContents.loadURL(req.body.url);
        res.send(req.body.url);
    });
    appey.post('/api/back', function(req, res) {
        view.webContents.goBack();
        setTimeout(function() {
            res.send(view.webContents.getURL());
        }, 500);
    });
        appey.post('/api/forward', function(req, res) {
        view.webContents.goForward();
        setTimeout(function() {
            res.send(view.webContents.getURL());
        }, 500);
    });
    appey.post('/api/reload', function(req, res) {
        view.webContents.reload();
        res.send('Finished reloading page');
    });
    globalShortcut.register("CommandOrControl+R", () => {
        view.webContents.reload();
    })
}

appey.listen(8080);

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
