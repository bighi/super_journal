const Configstore = require('configstore')

const defaults = {
  'directory': '~/journals',
  'journals': ['main'],
  'editor': 'vim',
  'extension': 'md'
}

const conf = new Configstore('super_journal', defaults)
module.exports = conf
