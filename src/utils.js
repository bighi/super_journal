const conf = require('./config')
const path = require('path')
const os = require('os')
const fs = require('fs')
const moment = require('moment')
const Entry = require('./entry')

function readJournal (journalName) {
  if (journalName === undefined || journalName === '') {
    journalName = conf.get('journals')[0]
  }

  const path = _journalPath(journalName)
  return fs.readFileSync(path, 'utf8')
}

function convertToTimestamp (dateString) {
  return moment(dateString).format('X')
}

function _journalPath (journalName) {
  let dir = conf.get('directory')
  const ext = conf.get('extension')

  if (dir[0] === '~') {
    dir = path.join(os.homedir(), dir.slice(1))
  }

  return path.join(dir, journalName + '.' + ext)
}

function getEntries (journalName) {
  const journalContent = readJournal(journalName)
  // const splitPattern = /\n$ \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
  const splitPattern = /\n\n\$ /m

  let entries = []
  entries = journalContent.split(splitPattern).map((rawEntry) => {
    return new Entry(rawEntry)
  })

  return entries
}

function sortEntries (entries) {
  return entries.sort((a, b) => a.timestamp - b.timestamp)
}

function filterNumber (entries, number) {
  console.log('filtering by number', number)
  return entries.slice(0 - number)
}

function filterDate (entries, startDate, endDate) {
  if (startDate === undefined && endDate === undefined) { return entries }

  if (startDate) {
    startDate = convertToTimestamp(startDate)
    entries = entries.filter((entry) => entry.timestamp >= startDate)
  }

  if (endDate) {
    endDate = convertToTimestamp(endDate)
    entries = entries.filter((entry) => entry.timestamp <= endDate)
  }

  return entries
}

function filterTags (entries, tagList) {
  if (tagList === undefined) { return entries }
  console.log('filtering by tags', tagList)

  tagList.split(',').forEach((tag) => {
    entries = entries.filter((entry) => entry.tags.includes(tag))
  })

  return entries
}

module.exports = {
  readJournal,
  convertToTimestamp,
  getEntries,
  sortEntries,
  filterNumber,
  filterDate,
  filterTags
}
