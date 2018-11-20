#!/usr/bin/env node

const program = require('commander')
const utils = require('./src/utils')
const conf = require('./src/config')

program
  .option('-n, --number <number>', 'The number of journal entries to read', 10)
  .option('-t, --tag <@tag1,@tag2>', 'Show only entries with the specified tag(s)')
  .option('-f, --from <"YYYY-MM-DD hh:mm:ss">', 'Show only entries starting on the date and time')
  .option('-u, --until <"YYYY-MM-DD hh:mm:ss">', 'Show only entries before that date and time')
  .option('-j, --journal <journal1,journal2>', 'Selects one or more journals (comma-separated)', conf.get('journals')[0])
  .parse(process.argv)

// I have to make an array with the desired journals, but if the user passed
// 'ALL' as a parameter then I have to get all the journals defined in the
// user's config file.
let journals = []
if (program.journal) {
  if (program.journal === 'all') {
    journals = conf.get('journals')
  } else {
    journals = program.journal.split(',')
  }
}

// We check if the user passed journals that are listed in his config file
if (journals.length > 0) {
  journals.forEach(journal => {
    if (!utils.validateJournal(journal)) {
      console.log('Error: one (or more) journal is not valid')
      process.exit(1)
    }
  })
}

// The order of the filters is important. First I get them by date, which is
// faster than filtering by tag. Then I filter by tag. And only them I count
// them, because I don't want to count entries that will be removed later.
let entries = utils.getEntriesFromJournals(journals)
entries = utils.sortEntries(entries)
entries = utils.filterDate(entries, program.from, program.until)
entries = utils.filterTags(entries, program.tag)
entries = utils.filterNumber(entries, program.number)

// Write them in the user's terminal
entries.forEach((entry) => {
  console.log(entry.formattedContent())
})
