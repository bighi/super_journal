#!/usr/bin/env node

var program = require('commander')

program
  .version('1.0.0')
  .command('write', 'write an entry to the journal')
  .command('read', 'read the latest journal entries')
  .command('edit [journal]', 'edit one or more entries')

// When parsed, the read and write commands will be forwarded to jnl-read.js and
// jnl-write.js, respectively.
program.parse(process.argv)
