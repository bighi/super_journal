#!/usr/bin/env node

var program = require('commander')

program
  .version('1.0.0')
  .command('write', 'write an entry to the journal')
  .command('read', 'read the latest journal entries')

program.parse(process.argv)
