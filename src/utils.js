const conf = require('./config')
const path = require('path')
const os = require('os')
const fs = require('fs')

function readJournal (journalName) {
  if (journalName === undefined || journalName === '') {
    journalName = conf.get('journals')[0]
  }

  const path = _journalPath(journalName)
  return fs.readFileSync(path, 'utf8')
}

function numericalizeDateString (dateString) {
  if (dateString === undefined || dateString === null) { return false }

  return dateString.split('.')[0]
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\s/g, '')
    .replace(/T/g, '')
}

function dateToString (date) {

}

function _journalPath (journalName) {
  let dir = conf.get('directory')
  const ext = conf.get('extension')

  if (dir[0] === '~') {
    dir = path.join(os.homedir(), dir.slice(1))
  }

  return path.join(dir, journalName + '.' + ext)
}

module.exports = {
  readJournal,
  numericalizeDateString,
  dateToString
}
