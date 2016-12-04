# SpaceGame
An exercise in web programming.

[Design Doc](https://docs.google.com/document/d/1JXoDWlAkCuwvB_h88CZQTN37Kz0b176Fl4FXOW26tEo/edit?usp=sharing)

[Trello board!](https://trello.com/b/g4PNq8ho/space-game-main) [Link to join.](https://trello.com/invite/b/g4PNq8ho/1b7d45d6e9cba26c7bd632350a605df9/space-game-main)

[Slack channel!](https://spacegameproject.slack.com)

[WSGI_Server on DockerHub](https://hub.docker.com/r/sethborder/wsgi-server/)

# Automatic Setup with Docker
* Install docker.
* While it's installing, edit your /etc/hosts file so that www.spacegame.com, spacegame.com, and dblocation all point at your local machine.
* Pull down sethborder/wsgi_server and sethborder/websocket_server.
* Run the start_container.sh  and start_websocket_container.sh scripts, replacing the ~/GitHub/SpaceGame/WSGI, ~/GitHub/SpaceGame/site, and ~/GitHub/SpaceGame/websockets directories with the links to where you've put the WSGI, site and websockets folders from this git repository. (In your local copy, please! The version on git should stay with the links as they are, so that this walkthrough makes sense.)
* (Note: This script assumes you have only one network interface running, you're using IPV4, and that ifconfig works on your system. If this isn't true, you'll have to manually run the 2nd line, substituting in your IP address for the variable $HOST_IP.)
* Once you get the terminal, run /usr/local/bin/start.sh to start the server. (The same script is used to start both servers.)


# Set Up App Manually
This setup is slightly outdated, and Docker is the prefered way to run this project now. Please note that these docs may be somewhat out of date, and do not include instructions to set up the websocket server, though it is fairly straightforward and vanilla python, so if you want to do it locally it shouldn't be hard.
* Install Python 3.5
* Set up pip (or pip3) and make sure it's the 3.5 version.
* Install mysql-connector-python from here: http://dev.mysql.com/downloads/connector/python/
* (Note: If the default version of python is not the version you want to install mysql-connector-python for, you'll need to grab the tarball instead, and then install it by following the instructions here: http://dev.mysql.com/doc/connector-python/en/connector-python-installation-source.html, substituting 'python' out for your version's name where appropriate.)
* pip(3) install mod-wsgi
* Run the command: mod_wsgi-express install-module
* Run the command 'mod_wsgi-express module-location', and note the output. Put this in your httpd.conf list of modules.
* httpd.conf will also need a few other changes, such as providing the WSGIPythonHome directive at the bottom, setting the 'Listen' line to *:80, setting LogLevel to info for development purposes, and... I think that's it? I may be forgetting something. (Note: If you're worried about other people finding your server, you can set the listen values to 127.0.0.1:80 instead for some extra security.)
* Create a WSGI application file, like the one provided in the repo.
* Create virtual host in whatever file is appropriate for your environment, following the pattern of the one in the repo.
* Update /etc/hosts so that www.spacegame.com, spacegame.com, and dblocation point at your localhost.
* Double check your permissions! The .wsgi file should not be in the document root for security reasons (I put mine in /usr/local/www/wsgi-scripts/), so make sure the webserver can read at all the locations necessary. Also ensure that the apache user has read/write on server_log.txt, or they'll have a lot of trouble using it.
* Restart apache with 'sudo apachectl restart'.
* Run the command: mod_wsgi-express start-server
* Go to www.spacegame.com, and hopefully see a hello world message!
* Copy schema_saver.sh to .git/hooks/pre-commit (the file pre-commit, not the folder). This will (once it's working) keep the database schema in the repository. Make sure to turn execute permissions on, or git won't have much luck trying to run it.
* (Bonus tip! If you set up the document root of your apache server to by symlinked to your github repo, you won't have to worry about copying files back and forth. This works for the WSGI folder too.)
* (Other bonus tip: If you go to localhost:8000 once the server is running you'll see the WSGI splash page, which includes a link to the setup docs.)

# Set Up Database (Always Manual.)
* Install MySQL locally. Note that even if you're using a containerized version of the site with Docker, you still need to install the database on your host machine. Docker should be set up to talk to it, and this way the data will persist.
* Using schema.sql as a reference, create the tables with the appropriate columns. This can be done two ways:
  1. Manually.
  2. By running mysql -u root -p$MYSQL_ROOT_PASSWORD_GOES_HERE SpaceGame < $GIT_DIRECTORY_GOES_HERE/schema.sql (Please note, there is no space inbetween the -p and the root password. If you include one, it will assume it's part of the password.)
* (Note: If you're later editing the database, you can use mysqldump to generate a new schema.sql file, or install the git hook in the repository root so that it will automatically update the schema file whenever you commit.)
* Run the following commands to add the users that will be needed:
  1. CREATE USER 'backup'@'%' IDENTIFIED BY 'beepbeepbeep';
  2. CREATE USER 'space'@'%' IDENTIFIED BY 'spaaaaace';
  3. GRANT LOCK TABLES, SELECT ON SpaceGame.* TO 'backup'@'%' IDENTIFIED BY 'beepbeepbeep';
  4. GRANT LOCK TABLES, SELECT, INSERT, DELETE, UPDATE ON SpaceGame.* TO 'space'@'%' IDENTIFIED BY 'spaaaaace';
* Once everything is running a little smoother, we'll secure these passwords more. At the moment I'm prioritizing ease of setup over security a little more than I normally would.
