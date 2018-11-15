#!/usr/bin/env node

var program = require('commander')

program
  .option('-f, --force', 'force installation')
  .parse(process.argv)

console.log('write')
