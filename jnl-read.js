#!/usr/bin/env node

const program = require('commander')
const utils = require('./src/utils')

program
  .option('-n, --number <number>', 'The number of journal entries to read', 10)
  .option('-t, --tag <tag>', 'Show only entries with the specified tag(s)')
  .option('-f, --from <date>', 'Show only entries starting on the date and time')
  .option('-u, --until <date>', 'Show only entries before that date and time')
  .option('-j, --journal <journal1,journal2>', 'Selects one or more journals (comma-separated)')
  .parse(process.argv)

let journals = []
if (program.journal) {
  journals = program.journal.split(',')
}

let entries = utils.getEntriesFromJournals(journals)
entries = utils.sortEntries(entries)
entries = utils.filterDate(entries, program.from, program.until)
entries = utils.filterTags(entries, program.tag)
entries = utils.filterNumber(entries, program.number)

entries.forEach((entry) => {
  console.log(entry.date, entry.tags.join())
})
