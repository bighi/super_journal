const utils = require('./utils')

function getEntries (journalName) {
  const journalContent = utils.readJournal(journalName)
  // const splitPattern = /\n$ \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
  const splitPattern = /\n\n\$ /m

  let entries = []
  entries = journalContent.split(splitPattern).map((rawEntry) => {
    return new Entry(rawEntry)
  })

  return entries
}

function sortEntries (entries) {
  return entries.sort((a, b) => a.numericWhen - b.numericWhen)
}

function filterNumber (entries, number) {
  console.log('filtering by number', number)
  return entries.slice(0 - number)
}

function filterDate (entries, startDate, endDate) {
  if (startDate === undefined && endDate === undefined) { return entries }
  console.log('filtering by date', startDate, endDate)
  console"entries".log('received', entries.length, 'entries')

  if (startDate) {
    startDate = utils.numericalizeDateString(new Date(startDate).toISOString())
    entries = entries.filter((entry) => { entry.numericWhen >= startDate })
  }

  if (endDate) {
    endDate = utils.numericalizeDateString(new Date(endDate).toISOString())
    entries = entries.filter((entry) => { entry.numericWhen <= endDate })
  }

  console.log('returning', entries.length, 'entries')
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

class Entry {
  constructor (rawEntry) {
    this.parse(rawEntry)
  }

  parse (rawEntry) {
    if (rawEntry === '') { return false }

    let lines = rawEntry.split(/\n/)
    this.date = this.findDate(lines.shift())
    this.tags = []
    this.content = lines.join('\n')
  }

  get date () {
    return this._date
  }

  set date (value) {
    this._date = value
    this.numericDate = utils.numericalizeDateString(new Date(this._date).toISOString())
  }

  get content () {
    return this._content
  }

  set content (value) {
    this._content = value
    this.tags = this.findTags()
  }

  findDate (line) {
    const pattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:?\d{0,2}/
    return line.match(pattern)[0]
  }

  findTags () {
    const tags = this.content.match(/@\w+/g)

    if (tags && tags.length > 0) {
      return tags
    } else {
      return []
    }
  }
}

module.exports = {
  getEntries,
  sortEntries,
  filterNumber,
  filterDate,
  filterTags
}
