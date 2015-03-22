# levelgraph-n3-import

Command line interface for importing RDF N-triple files into a [LevelGraph](https://github.com/mcollina/levelgraph) database (with the [LevelGraph-N3](https://github.com/mcollina/levelgraph-n3) extension).

### Usage

To install, run `npm install -g levelgraph-n3-import`.

To import files, run `levelgraph-n3-import path/to/db path/to/n3/file(s)`. File extensions must be `.n3` or `.nt`. Additionally, there is glob support, so for example `*.nt` will match all the matching n-triple files and import them all.

##### quiet mode

`-q` or `--quiet` will not output any status updates during the import process. Otherwise, progress is displayed.