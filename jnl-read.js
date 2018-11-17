#!/usr/bin/env node

const program = require('commander')
const utils = require('./src/utils')

program
  .option('-n, --number [number]', 'The number of journal entries to read', 10)
  .option('-t, --tag [tag]', 'Show only entries with the specified tag(s)')
  .option('-f, --from [date]', 'Show only entries starting on the date and time')
  .option('-u, --until [date]', 'Show only entries before that date and time')
  .parse(process.argv)

console.log('read')

const unfilteredEntries = utils.sortEntries(utils.getEntries())

const entriesByDate = utils.filterDate(unfilteredEntries, program.from, program.until)
const entriesByTag = utils.filterTags(entriesByDate, program.tag)
const entriesByCount = utils.filterNumber(entriesByTag, program.number)

entriesByCount.forEach((entry) => {
  console.log(entry.date, entry.tags.join())
})
