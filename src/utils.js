// This file hold a collection of useful functions that will be used in many
// other files of this project.

const conf = require('./config')
const path = require('path')
const os = require('os')
const fs = require('fs')
const moment = require('moment')
const entry = require('./entry')

// Reads the entire content of a journal and returns it in a giant string.
function readJournal (journalName) {
  const path = journalPath(journalName)
  createIfNotExists(path)
  return fs.readFileSync(path, { encoding: 'utf8' })
}

// Checks if the file exists, and if the directory of the file also exists. if
// not, then creates the directory or file (whatever is needed).
// This is the best way to guarantee that a journal exists.
function createIfNotExists (filePath) {
  const directory = require('path').dirname(filePath)

  // Checks the directory first
  if (!fs.existsSync(directory)) {
    console.log("Directory for the journal doesn't exist. Creating it.")
    fs.mkdirSync(directory)
  }

  // Now checks the file
  if (!fs.existsSync(filePath)) {
    console.log("Text file for the journal doesn't exist. Creating it.")
    fs.closeSync(fs.openSync(filePath, 'a'))
  }
}

// Converts a moment() date to the UNIX timestamp
function convertToTimestamp (dateString) {
  return moment(dateString).format('X')
}

// Returns the full path to a given journal. If no journal argument was passed,
// returns the first journal from the config file.
function journalPath (journalName) {
  if (journalName === undefined || journalName === '') {
    journalName = conf.get('journals')[0]
  }

  let dir = conf.get('directory')
  const ext = conf.get('extension')

  // Expands the tilde into the path for the user's home dir
  // Only necessary because node doesn't do it by itself.
  if (dir[0] === '~') {
    dir = path.join(os.homedir(), dir.slice(1))
  }

  return path.join(dir, journalName + '.' + ext)
}

// Returns an array of Entry objects with the combined content of
// multiple journals. Useful for reading.
function getEntriesFromJournals (journals) {
  let entries = []
  journals.forEach(journal => {
    const journalEntries = getEntriesFromSingleJournal(journal)
    entries = entries.concat(journalEntries)
  })
  return entries
}

// Returns an array of Entry objects with the content of a SINGLE journal.
// This function was initially designed to be called only by getEntriesFromJournals,
// but was later used in the WRITE command.
//
// TODO: Make the splitPattern smarter and more robust. I'm afraid it will
// break if the user writes something like a dollar amount at a beginning of
// a line.
function getEntriesFromSingleJournal (journal) {
  let contents = readJournal(journal)
  if (contents === '') { return [] }

  let entries = []
  const splitPattern = /\n\n\$ /m
  entries = contents.split(splitPattern).map((rawEntry) => {
    return entry.buildFromText(rawEntry)
  })

  return entries
}

// Sort entries chronologically.
function sortEntries (entries) {
  return entries.sort((a, b) => a.timestamp - b.timestamp)
}

// Used with the number argument when reading.
// This function returns only the most recent N entries from the array, by
// counting from the end. That's why it uses a negative number when slicing.
function filterNumber (entries, number) {
  return entries.slice(0 - number)
}

// Used with the date arguments when reading.
// This function returns only entries AFTER startDate and/or before endDate.
// Can be used by informing only one of the dates, but can't be missing both dates.
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

// Used by the tag filter when reading. This returns only entries that include
// ALL of the given tags.
//
// TODO: Allow the user to also search for ANY of the tags,
// instead of ALL of them.
function filterTags (entries, tagList) {
  if (tagList === undefined) { return entries }

  tagList.split(',').forEach((tag) => {
    entries = entries.filter((entry) => entry.tags.includes(tag))
  })

  return entries
}

function validateJournal (journalName) {
  return conf.get('journals').includes(journalName)
}

module.exports = {
  readJournal,
  convertToTimestamp,
  getEntriesFromJournals,
  getEntriesFromSingleJournal,
  sortEntries,
  filterNumber,
  filterDate,
  filterTags,
  journalPath,
  validateJournal
}
