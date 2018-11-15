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
  return entries.sort((a, b) => a.rawWhen - b.rawWhen)
}

function filterNumber (entries, number) {
  return entries.slice(0 - number)
}

function filterDate (entries, startDate, endDate) {
  return entries
}

function filterTags (entries, tagList) {
  if (tagList === undefined) { return entries }

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
    this.when = this.findWhen(lines.shift())
    this.tags = []
    this.content = lines.join('\n')
  }

  get when () {
    return this._when
  }

  set when (value) {
    this._when = value
    this.rawWhen = value
                    .replace(/-/g, '')
                    .replace(/:/g, '')
                    .replace(/\s/g, '')
  }

  get content () {
    return this._content
  }

  set content (value) {
    this._content = value
    this.tags = this.findTags()
  }

  findWhen (line) {
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
