const moment = require('moment')

class Entry {
  constructor (date, content) {
    this.date = date
    this.content = content
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
    this.tags = this._findTags()
  }

  formattedContent () {
    return '$ ' + this.date + '\n' + this.content + '\n\n'
  }

  _findTags () {
    const tags = this.content.match(/@\w+/g)

    if (tags && tags.length > 0) {
      return tags
    } else {
      return []
    }
  }
}

function buildFromText (rawEntry) {
  if (rawEntry === '') { return false }

  let lines = rawEntry.split(/\n/)
  const date = _findDate(lines.shift())
  const content = lines.join('\n')
  return new Entry(date, content)
}

function _findDate (line) {
  const pattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:?\d{0,2}/
  return line.match(pattern)[0]
}

module.exports = {
  buildFromText,
  Entry
}

// module.exports.Entry = Entry
// module.exports.buildEntryFromText = buildEntryFromText
