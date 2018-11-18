const moment = require('moment')
const nm = require('next_monday')

class Entry {
  constructor (date, content) {
    this.date = date
    this.content = content
  }

  get date () {
    return this._date.format('YYYY-MM-DD HH:mm:ss')
  }

  set date (dateString) {
    const match = dateString.match(/(yesterday|today|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/g)

    if (match && match.length > 0) {
      this._date = this._parseSpecialDate(match[0], dateString)
    } else {
      this._date = moment(dateString)
    }
    this.timestamp = this._date.format('X')
  }

  get content () {
    return this._content
  }

  set content (value) {
    if (value === undefined || value === '') { return false }

    value = value.replace(/\n+$/g, '')

    this._content = value
    this.tags = this._findTags()
  }

  formattedContent () {
    return '$ ' + this.date + '\n' + this.content + '\n'
  }

  _parseSpecialDate (day, dateString) {
    let date

    switch (day) {
      case 'today':
        dateString = dateString.replace(/today/, moment().format('YYYY-MM-DD'))
        break
      case 'yesterday':
        date = moment().subtract(1, 'day').format('YYYY-MM-DD')
        dateString = dateString.replace(/yesterday/, date)
        break
      default:
        date = nm.findPreviousDayOfWeek(day)
        dateString = dateString.replace(day, moment(date).format('YYYY-MM-DD'))
    }

    return moment(dateString)
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
