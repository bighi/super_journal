#!/usr/bin/env node

const program = require('commander')
const editor = require('editor')
const utils = require('./src/utils')
const Entry = require('./src/entry').Entry
const fs = require('fs')

program
  .option('-d, --date <"YYYY-MM-DD hh:mm:ss">', 'Set the date for the entry')
  .option('-c, --content <"the content for the entry">', 'The text for the entry')
  .option('-j, --journal <journal>', 'Set a journal to write in')
  .parse(process.argv)

// We check if the user passed a journal that is listed in his config file
if (program.journal && !utils.validateJournal(program.journal)) {
  console.log('Error: journal name is not valid')
  process.exit(1)
}

if (program.content && program.content !== '') {
  createEntryFromArgs(program.date, program.content, program.journal)
} else {
  createEntryFromEditor(program.date, program.journal)
}

// This creates a new Entry from arguments passed through the command line.
// This is intended as a quick way to write without opening an editor.
function createEntryFromArgs (date, content, journal) {
  const entry = new Entry(date, content)
  insertEntry(entry, journal)
}

// This function is similar to the other one, but it opens an external editor
// defined by the $EDITOR env variable. It works by creating a temp file,
// editing it in the selected editor, reading its value and then deleting it.
function createEntryFromEditor (date, journal) {
  editor('./temp', (code, sig) => {
    // I don't know when this error might occur, but if the editor exits with
    // a nonzero error code, something bad happened.
    if (code !== 0) {
      console.log('An error ocurred and the file will not be saved')
      return false
    }

    fs.readFile('./temp', 'utf8', (err, content) => {
      // This happens when the user quits the editor without saving the file
      if (err) {
        console.log('Error: user quit the editor without saving')
        return false
      }

      // Deleting the temp file is important because otherwise its content would
      // be seen again when creating another entry.
      fs.unlink('./temp', () => {})

      const entry = new Entry(date, content)
      insertEntry(entry, journal)
    })
  })
}

// This function is responsible for getting all the entries from the journal,
// inserting the new entry among them ORDERED BY TIME, and them calling another
// function to save them all back to the journal file.
// Useful because new entries might be created BEFORE ones that already exist.
function insertEntry (entry, journal) {
  let entries = utils.getEntriesFromSingleJournal(journal)
  entries.push(entry)
  utils.sortEntries(entries)
  saveEntries(entries, journal)
}

// Effectively saves ALL the entries back to the journal. This ERASES the
// previous content of the journal. I'm not really sure if there's a potential
// for serious error here. If somehow I can't write all the entries back to the
// file, the entire journal content might be lost.
function saveEntries (entries, journal) {
  const contents = entries.map(entry => entry.formattedContent())

  // If the last entry ends with multiple endlines, I just remove the extra
  // line breaks.
  let journalContent = contents.join('\n').replace(/\n\n+$/, '\n')

  fs.writeFile(utils.journalPath(journal), journalContent, (err) => {
    if (err) {
      return console.log(err)
    }

    console.log('The file was saved!')
  })
}
