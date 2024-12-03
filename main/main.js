// chat gpt update # 1
// this is the same as main.js_claire_new.py
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');
const axios = require('axios');

const SERVER_BASE_URL = 'http://127.0.0.1:5000';

/*
Notes
No print functions in servers. Messes with Flask API.
Improved error handling for Axios requests.
*/

ipcMain.handle('load-dependencies', async (_event) => {
  const dependencies = require('../package.json').devDependencies;
  return Object.entries(dependencies).map(([key, value]) => {
    return { name: key, version: value };
  });
});

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.on('set-title', (event, title) => {
    win.setTitle(title);
  });

  ipcMain.handle('test-master-pass', async (_event, username, master_pass) => {
    const data = { master_pass, username };
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/add_master_password`, data);
      console.log(response.data);
    } catch (error) {
      console.error('Error in test-master-pass:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('validate-login', async (_event, username, master_pass) => {
    const data = { master_pass, username };
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/validate_login`, data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error in validate-login:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('get-master-password', async () => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/get_master_password`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response.data.username);
      return response.data;
    } catch (error) {
      console.error('Error in get-master-password:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('add-password', async (_event, data) => {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/add_password`, data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error in add-password:', error.message);
      return { error: error.message };
    }
  });

  ipcMain.handle('display-all-passwords', async () => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/display_all_passwords`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error in display-all-passwords:', error.message);
      return { error: error.message };
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    if (app.isPackaged) {
      win.loadFile('./pack/index.html');
    } else {
      await win.loadURL(`file://${path.join(__dirname, '../pack', 'index.html')}`);
    }
  }
};

let flaskProcess;

const startFlaskPython = () => {
  const venvPath = path.join(__dirname, '../mac_venv'); // Mac
  const pythonPath = path.join(venvPath, 'bin', 'python'); // Mac
  const flaskPath = path.join(__dirname, '../db/db_flask_server.py');

  console.log('.py');
  flaskProcess = spawn(pythonPath, ['-u', flaskPath]);

  flaskProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Flask: ${output}`);
    if (output.includes('* Running on')) {
      console.log('Flask is ready. Initializing database...');
      initDB();
    }
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask error: ${data.toString()}`);
  });
};

const exePath = app.isPackaged
  ? path.join(process.resourcesPath, 'db_flask_server.exe')
  : path.join(__dirname, '../db/dist/', 'db_flask_server.exe');

const startFlaskExe = () => {
  flaskProcess = spawn(exePath);

  flaskProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Flask (exe): ${output}`);
    if (output.includes('* Running on')) {
      console.log('Flask exe is ready. Initializing database...');
      initDB();
    }
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask exe error: ${data.toString()}`);
  });
};

app.whenReady().then(() => {
  if (app.isPackaged) {
    startFlaskExe();
  } else {
    startFlaskPython();
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  if (flaskProcess) {
    flaskProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const initDB = async () => {
  try {
    await axios.post(`${SERVER_BASE_URL}/init_db`);
    console.log('Database initialized!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

ipcMain.handle('init-db', async () => {
  try {
    await axios.post(`${SERVER_BASE_URL}/init_db`);
    return 'Initialized!';
  } catch (error) {
    console.error('Error in init-db IPC handler:', error.message);
    return { error: error.message };
  }
});