#!/usr/bin/env node

var levelgraph = require('levelgraph')
  , levelgraphN3 = require('levelgraph-n3')
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , progressStream = require('progress-stream');

var cli = require('cli')
  .enable('glob');

var options = cli.parse({
  quiet: ['q', 'Do not show progress information']
});

// create db output folder
try {
  var dbPath = mkdirp.sync(path.resolve(cli.args[0]));
  if (!dbPath) {
    dbPath = path.resolve(cli.args[0]);
  }
  if (!options.quiet) {
    console.log('\nLevelgraph database at: ' + dbPath);
  }

  // initialize levelgraph-n3
  var db = levelgraphN3(levelgraph(dbPath));
} catch (e) {
  console.error(e);
  process.exit(1);
}


try {

  // importing files
  cli.args.slice(1).forEach(function(a) {

    // normalize and resolve given file path
    var n3file = path.resolve(a);

    if (!options.quiet) {
      console.log('\nImporting RDF N-triple file: ' + n3file);
    }

    // must be .nt or .n3 file
    if (path.extname(n3file) !== '.nt' && path.extname(n3file) !== 'n3') {
      console.log('Invalid file. Must be .nt or n3 file.');
    } else {

      var fileStats = fs.statSync(n3file);
      var progstr = progressStream({
        length: fileStats.size,
        time: 1000
      }).on('progress', function(progress) {
        if(!options.quiet) {
          console.log(progress);
        }
      });

      var stream = fs.createReadStream(n3file)
        .pipe(progstr)
        .on('finish', function() {
          if (!options.quiet) {
            console.log('\nImport of ' + path.basename(n3file) + ' completed.');
          }
        })
        .pipe(db.n3.putStream());

    }

  });

} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  if (!options.quiet) {
    console.log('\nAll files imported to levelgraph-n3 database at: ' + path.relative(process.cwd(), dbPath));
  }
}
