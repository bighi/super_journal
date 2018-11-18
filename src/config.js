const Configstore = require('configstore')

const defaults = {
  'directory': '~/journals', // The directory where the journals will be saved
  'journals': ['main'], // What journals the user wants to have
  'extension': 'md' // What extension to use for the journal files
}

const conf =
  new Configstore('super_journal', defaults, { globalConfigPath: true })

module.exports = conf
