#!/bin/bash -e

DBHOST=localhost
DBUSER=backup
DBPASS=beepbeepbeep # This is terrible. Don't do this.
DBNAME=SpaceGame
GITREPO=/Users/gabeleonard/GitHub/SpaceGame/
cd $GITREPO
mysqldump -h $DBHOST -u $DBUSER -p$DBPASS -d $DBNAME > $GITREPO/schema.sql
git add schema.sql
git commit --no-verify -m "$DBNAME schema version $('date')"