const conf = require('./config')
const path = require('path')
const os = require('os')
const fs = require('fs')

function readJournal (journalName) {
  if (journalName === undefined || journalName === '') {
    journalName = conf.get('journals')[0]
  }

  const path = journalPath(journalName)
  return fs.readFileSync(path, 'utf8')
}

function journalPath (journalName) {
  let dir = conf.get('directory')
  const ext = conf.get('extension')

  if (dir[0] === '~') {
    dir = path.join(os.homedir(), dir.slice(1))
  }

  return path.join(dir, journalName + '.' + ext)
}

module.exports = {
  readJournal
}
