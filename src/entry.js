const moment = require('moment')

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
    return this._date.format('YYYY-MM-DD HH:mm:ss')
  }

  set date (dateString) {
    this._date = moment(dateString)
    this.timestamp = this._date.format('X')
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

module.exports = Entry
