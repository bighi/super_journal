const moment = require('moment')
const nm = require('next_monday')

class Entry {
  constructor (date, content) {
    this.date = date
    this.content = content
  }

  // If I ever need to refer to the date object, I should call refer to _date
  get date () {
    return this._date.format('YYYY-MM-DD HH:mm:ss')
  }

  // This not only sets the date, but also saves a UNIX timestamp that is used
  // when comparing two dates.
  // dateString can be anything that moment() understands, but can also be one
  // of some special strings, like 'sunday' or 'yesterday'.
  set date (dateString = moment().format('YYYY-MM-DD')) {
    const pattern = /(yesterday|today|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/g
    const matchedWord = dateString.match(pattern)

    if (matchedWord && matchedWord.length > 0) {
      this._date = this._parseSpecialDate(matchedWord[0], dateString)
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

    // I have to remove any line breaks at the end because line breaks are
    // created when reading from text files.
    value = value.replace(/\n+$/g, '')

    this._content = value
    this.tags = this._findTags()
  }

  // The formatted content will be used to display the entries in the CLI,
  // but also is what's going to be written to the journal text file.
  formattedContent () {
    return '$ ' + this.date + '\n' + this.content + '\n'
  }

  // Handles the special date words, like 'sunday', 'tuesday' or 'yesterday'.
  // It replaces these words with the proper date in the YYYY-MM-DD format
  // because there might be extra information in the string, like the time.
  // Then it returns a string ready to be interpreted by moment().
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
        // week days (sunday, monday, etc)
        date = nm.findPreviousDayOfWeek(day)
        dateString = dateString.replace(day, moment(date).format('YYYY-MM-DD'))
    }

    return moment(dateString)
  }

  // Finds the tags inside the text of the content.
  _findTags () {
    const tags = this.content.match(/@\w+/g)

    if (tags && tags.length > 0) {
      return tags
    } else {
      return []
    }
  }
}

// This is the improvised way of creating an entry from what I got from the text
// file of the journal. I use this after I got the text for the entire entry.
// I try my best to find what is the datetime, and what is actual content. Then
// use that to create a proper Entry object.
function buildFromText (rawEntry) {
  if (rawEntry === '') { return false }

  let lines = rawEntry.split(/\n/)
  const date = _findDate(lines.shift())
  const content = lines.join('\n')
  return new Entry(date, content)
}

// Finds the date inside a bigger string. Used when building an entry from text.
function _findDate (line) {
  const pattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:?\d{0,2}/
  return line.match(pattern)[0]
}

module.exports = {
  buildFromText,
  Entry
}
