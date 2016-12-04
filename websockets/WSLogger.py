import logging, os, os.path

logger = logging.getLogger("socket")

def log(msg):
  # This first line is not usable when running in docker. This is the one thing I haven't                                 
  # been able to find a good way to port, since the permissions don't work out on Docker                                  
  # and on a standard machine environment I can't assume file structure. Sigh.                                            
  #logging.basicConfig(filename = env['CONTEXT_DOCUMENT_ROOT'] + "/server_log.txt", level="INFO")                         

  log_dir = "/var/www/logs/socket_log.txt"
    #if not os.path.isfile(log_dir):                                                                                      
  #  file = open(log_dir, "w")                                                                                            
  #  file.write("Created log.")                                                                                           
  #  file.close()                                                                                                         
  logging.basicConfig(filename = log_dir, level = "INFO")
  logger.info(msg)
