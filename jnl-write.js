#!/usr/bin/env node

const program = require('commander')
const editor = require('editor')
const utils = require('./src/utils')
const Entry = require('./src/entry').Entry
const fs = require('fs')

program
  .option('-d, --date [date]', 'Set the date for the entry')
  .option('-c, --content [text]', 'The text for the entry')
  .parse(process.argv)

let entry

console.log('lets begin')

if (program.content && program.content !== '') {
  console.log('passed contend input:', program.content)
  entry = createEntryFromArgs(program.date, program.content)
  insertEntry(entry)
} else {
  entry = createEntryFromEditor(program.date)
}

console.log('write')

function createEntryFromArgs (date, content) {
  return new Entry(date, content)
}

function createEntryFromEditor (date) {
  editor('./temp', (code, sig) => {
    if (code !== 0) {
      console.log('The file was not saved')
      return false
    }

    fs.readFile('./temp', 'utf8', (err, content) => {
      if (err) {
        console.log("Error: entry won't be saved")
        return false
      }

      fs.unlink('./temp', () => {})
      const entry = new Entry(date, content)
      insertEntry(entry)
    })
  })
}

function insertEntry (entry) {
  let entries = utils.getEntries()
  entries.push(entry)
  utils.sortEntries(entries)
  saveEntries(entries)
}

function saveEntries (entries) {
  const contents = entries.map(entry => entry.formattedContent())
  let journalContent = contents.join('').replace(/\n\n+$/, '\n')

  fs.writeFile(utils.journalPath(), journalContent, (err) => {
    if (err) {
      return console.log(err)
    }

    console.log('The file was saved!')
  })
}
