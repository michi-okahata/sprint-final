const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { spawn } = require('child_process')
const axios = require('axios')

const os = require('os')

/*
Notes
No print functions in servers. Messes with flask API.
Still an UnhandledPromiseRejectionWarning somewhere.
*/

ipcMain.handle('load-dependencies', async (_event) => {
  const dependencies = require('../package.json').devDependencies
  return Object.entries(dependencies).map(([key, value]) => {
    return {
      name: key,
      version: value
    }
  })
})

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    win.setTitle(title)
  })

  ipcMain.handle('test-master-pass', async (event, username, master_pass) => {
    const data = {
      master_pass: master_pass,
      username: username
    }
    try {
      console.log('Sending data to /add_master_password:', data)
      const response = await axios.post('http://localhost:5000/add_master_password', data)
      console.log('Response from /add_master_password:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in test-master-pass:', error.response?.data || error.message)
      throw error
    }
  })
  

  ipcMain.handle('test-login', async (event, username, master_pass) => {
    const data = {
      master_pass: master_pass,
      username: username
    }
    try {
      const response = await axios.post('http://localhost:5000/validate_login', data)
      console.log(response.data)
      return response.data
    } catch (error) {
      throw error
    }
  })

  ipcMain.handle('get-master-password', async (event) => {
    try {
      const response = await axios.get('http://localhost:5000/get_master_password')
      console.log(response.data.username) // Works!
      return response.data
    } catch (error) {
      throw error
    }
  })

  if (app.isPackaged) {
    win.loadFile('./pack/index.html')
    // file:///C:/Users/michi/password/sprint-final/out/sprint-final-win32-x64/resources/app.asar/file:/C:/Users/michi/password/sprint-final/out/sprint-final-win32-x64/resources/app.asar/pack/index.html
    // await win.loadFile('./index.html')
  } else {
    // Not packaged.
    await win.loadURL(`file://${path.join(__dirname, '../pack', 'index.html')}`)
  }
}

let flaskProcess

const startFlaskPython = () => {
  // Virtual environment.

  const isWindows = process.platform === 'win32'
  const isMac = process.platform === 'darwin' || os.platform() === 'darwin'

  const venvPath = isWindows
  ? path.join(__dirname, '../win_venv') // Windows
  : isMac
  ? path.join(__dirname, '../venv') // macOS
  : path.join(__dirname, '../other_venv') // Other platformss

  const pythonPath = isWindows
  ? path.join(venvPath, 'Scripts', 'python.exe') // Windows
  : isMac
  ? path.join(venvPath, 'bin', 'python3') // macOS
  : path.join(venvPath, 'bin', 'python3') // Default for non-Windows

  const flaskPath = path.join(__dirname, '../db/db_flask_server.py')

  console.log(".py")
  // Py.
  flaskProcess = spawn(pythonPath, ['-u', flaskPath])

  flaskProcess.stdout.on('data', (data) => {
    if (data.includes('* Serving Flask app \'db_flask_server\'')) {
      initDB()
    }
  })

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask error: ${data}`)
  })
}

let exePath
if (app.isPackaged) {
  exePath = path.join(process.resourcesPath, 'db_flask_server.exe')
} else {
  exePath = path.join(__dirname, '../db/dist/', 'db_flask_server.exe')
}

const startFlaskExe = () => {
  // Exe.
  flaskProcess = spawn(exePath)

  flaskProcess.stdout.on('data', (data) => {
    if (data.includes('* Serving Flask app \'db_flask_server\'')) {
      initDB()
    }
  })

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask error: ${data}`)
  })
}

app.whenReady().then(() => {
  // startFlask includes flask and initDB()
  if (app.isPackaged) {
    startFlaskExe()
  } else {
    startFlaskPython()
  }
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  if (flaskProcess) {
    flaskProcess.kill()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const initDB = () => {
  try {
    axios.post('http://localhost:5000/init_db')
  } catch (error) {
    console.error('Error in main init-db:', error)
    throw error
  }
}

// IPC.
// InitDB.
ipcMain.handle('init-db', async (event) => {
  try {
    const response = await axios.post('http://localhost:5000/init_db')
    return 'Initialized!'
  } catch (error) {
    console.error('Error in main init-db:', error)
    throw error
  }
})
