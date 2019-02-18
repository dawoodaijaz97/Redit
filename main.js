const electron = require('electron');
const url = require('url');
const path = require('path');
const mysql = require('mysql');
const db = require('./db');
require('dotenv').config();

const {app, BrowserWindow, Menu} = electron;

let mainWindow;


app.on('ready', function(){
    //create main window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "CARNAC - Reddit Trend Analyzer "
    });
    //quit app on close
    mainWindow.on('closed', function(){
        app.quit();
    });
    //connects to mysql
    db.db().connect(function(err, a){
        //throw error and quit app if connection fails
        if (err){
            app.quit();
            throw err;
        }

        //Load HTML into window
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'html/index.html'),
            protocol: 'file',
            slashes: true
        }));    

        //wait for page contents to load before displaying electron window
        mainWindow.once('ready-to-show', function(){
            mainWindow.show();
        });

    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Dashboard',
                click(){
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'html/index.html'),
                        slashes: true
                    }));
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });
            
                }
            },
            {
                label: 'Login',
                click(){
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'html/login.html'),
                        slashes: true
                    }));
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });
            
                }
            },
            {
                label: 'Create New Account!',
                click(){
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'html/register.html'),
                        slashes: true
                    }));
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });            
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform = 'darwin' ? 'Command+Q' : 
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//add developer tools if not in production mode
if (process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label:'Open / Close',
                accelerator: process.platform = 'darwin' ? 'Command+I' : 
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}