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

function createEntryFromEditor () {

}

function insertEntry (entry) {
  let entries = utils.getEntries()
  entries.push(entry)
  utils.sortEntries(entries)
  saveEntries(entries)
}

function saveEntries (entries) {
  const contents = entries.map(entry => entry.formattedContent())

  fs.writeFile(utils.journalPath(), contents.join(''), (err) => {
    if (err) {
      return console.log(err)
    }

    console.log('The file was saved!')
  })
}
