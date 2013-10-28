# Spare [![Build Status](https://travis-ci.org/garbados/spare.png)](https://travis-ci.org/garbados/spare) [![Coverage Status](https://coveralls.io/repos/garbados/spare/badge.png)](https://coveralls.io/r/garbados/spare)

Creates a cronjob that takes periodic snapshots of a remote Cloudant / CouchDB instance, using PouchDB.

## Install

    npm install -g spare

If that doesn't work, try prepending `sudo`.

## Usage

Spare exposes a CLI that you use to create and manage cronjobs appropriately, taking commands in this format:

    spare watch -m <remote>

Then, every day at midnight, Spare will replicate the remote instance's contents to a local LevelDB.

To do a one-off backup of a remote instance, use `backup` instead:

    spare backup -m <remote>

To restore a remote based on a local backup, use `restore`:

    spare restore -m <remote> -i <YYYY-MM-DD>

## Testing

    npm test

## License

[MIT](http://opensource.org/licenses/MIT), yo.