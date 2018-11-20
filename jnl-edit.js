#!/usr/bin/env node

const program = require('commander')
const utils = require('./src/utils')
const conf = require('./src/config')
const editor = require('editor')

program
  .option('-j, --journal <journal>', 'Selects one or more journals (comma-separated)', conf.get('journals')[0])
  .option('-e, --editor <editor>', 'Use a different editor to open the journal')
  .parse(process.argv)

// We check if the user passed a journal that is listed in his config file
if (program.journal && !utils.validateJournal(program.journal)) {
  console.log('Error: journal name is not valid')
  process.exit(1)
}

if (program.editor) {
  process.env.EDITOR = program.editor
}

const path = utils.journalPath(program.journal)
editor(path, (code, sig) => {})
