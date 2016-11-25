# SpaceGame
An exercise in web programming.
Trello board is here: https://trello.com/b/g4PNq8ho/space-game-main

# Set Up App
* Install Python 3.5
* Set up pip (or pip3) and make sure it's the 3.5 version.
* pip(3) install mod-wsgi
* Run the command: mod_wsgi-express install-module
* Run the command 'mod_wsgi-express module-location', and note the output. Put this in your httpd.conf list of modules.
* httpd.conf will also need a few other changes, such as providing the WSGIPythonHome directive at the bottom, setting the 'Listen' line to *:80, setting LogLevel to info for development purposes, and... I think that's it? I may be forgetting something. (Note: If you're worried about other people finding your server, you can set the listen values to 127.0.0.1:80 instead for some extra security.)
* Create a WSGI application file, like the one provided in the repo.
* Create virtual host in whatever file is appropriate for your environment, following the pattern of the one in the repo.
* Update /etc/hosts so that www.spacegame.com and spacegame.com point at your localhost.
* Double check your permissions! The .wsgi file should not be in the document root for security reasons (I put mine in /usr/local/www/wsgi-scripts/), so make sure the webserver can read at all the locations necessary. Also ensure that the apache user has read/write on server_log.txt, or they'll have a lot of trouble using it.
* Restart apache with 'sudo apachectl restart'.
* Run the command: mod_wsgi-express start-server
* Go to www.spacegame.com, and hopefully see a hello world message!
* Copy schema_saver.sh to .git/hooks/pre-commit (the file pre-commit, not the folder). This will (once it's working) keep the database schema in the repository. Make sure to turn execute permissions on, or git won't have much luck trying to run it.
* (Bonus tip! If you set up the document root of your apache server to by symlinked to your github repo, you won't have to worry about copying files back and forth.)
* (Other bonus tip: If you go to localhost:8000 once the server is running you'll see the WSGI splash page, which includes a link to the setup docs.)

# Set Up Database
* Install mysql-connector-python from here: http://dev.mysql.com/downloads/connector/python/
* (Note: If the default version of python is not the version you want to install mysql-connector-python for, you'll need to grab the tarball instead, and then install it by following the instructions here: http://dev.mysql.com/doc/connector-python/en/connector-python-installation-source.html, substituting 'python' out for your version's name where appropriate.)
* Using schema.sql as a reference, create the tables with the appropriate columns.
* The following users will be needed:
1. Username 'backup', with password 'beepbeepbeep'. Permissions SELECT, and LOCK TABLES.
2. Username 'space', with password 'spaaaaace'. (Five a's, like space has five letters.) Permissions SELECT, DELETE, UPDATE, INSERT, and LOCK TABLES.
* Once everything is running a little smoother, we'll secure these passwords more. At the moment I'm prioritizing ease of setup over security a little more than I normally would.
