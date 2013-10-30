# Spare [![Build Status](https://travis-ci.org/garbados/spare.png)](https://travis-ci.org/garbados/spare) [![NPM version](https://badge.fury.io/js/spare.png)](http://badge.fury.io/js/spare)

Command line utility for taking periodic snapshots of a remote Cloudant / CouchDB instance, using PouchDB.

## Install

    npm install -g spare

If that doesn't work, try prepending `sudo`.

## Usage

To create a daily snapshot of a remote instance, use the `watch` command, like this:

    spare watch -r <remote>

To do a one-off backup of a remote instance, use `backup` instead:

    spare backup -r <remote>

You can also backup to another remote instance, rather than locally, using the `-t` or `--target` flags:

    spare backup -r <remote> -t <target>

To restore a remote based on a local backup, use `restore`:

    spare restore -r <remote> -d <YYYY-MM-DD>

The `-d` argument indicates a backup made on a certain day.

To destroy a local backup of a certain day, use `remove`:

    spare remove -r <remote> -d <YYYY-MM-DD>

To run any of these commands on a regular basis, try adding them to your [crontab](http://unixhelp.ed.ac.uk/CGI/man-cgi?crontab+5), like so:

    crontab -e
    # now, in your text editor, add a command like this:
    @reboot spare watch -r <remote>

That will backup the given remote instance every day at midnight.

## Testing

    npm test

## License

[MIT](http://opensource.org/licenses/MIT), yo.