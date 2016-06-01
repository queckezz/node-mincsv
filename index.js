'use strict';


function parse(str, delimiter) {
  const lines      = str.split('\n').filter(line => line);
  const headers    = parseLine(lines.shift(), delimiter);
  const rows       = lines.map((line) => parseLine(line, delimiter));
  const objectRows = rows.map(function(row) {
    return row.reduce(function(object, column, index) {
      const name   = headers[index];
      object[name] = column;
      return object;
    }, {});
  });

  return objectRows;
}


// This is a modified version of the world-famous CSVToArray by Ben Nadel:
// http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm

function tokenize (delimiter) {
  if (!delimiter)
    delimiter = ',';

    return new RegExp(
    // Delimiters.
    `(\\${delimiter}|^)` +
    // Quoted fields.
    `(?:"([^"]*(?:""[^"]*)*)"|` +
    // Standard fields.
    `([^"\\${delimiter}]*))`
  ,
  'gi');
}


function parseLine(str, delimiter) {
  if (!str)
    return null;

  const regexp = tokenize(delimiter);
  const row = [];
  let   match;
  while (match = regexp.exec(str)){
    if (match[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      const unquoted = match[2].replace(/""/g, '"');
      row.push(unquoted);
    }
    else
      row.push(match[3]);
  }
  return row;
}


module.exports = { parse };
