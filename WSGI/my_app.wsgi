import os, sys
#import logging
import http.cookies
import site 
site.addsitedir(os.path.dirname(__file__))
import ajax, uri, logger

#logger = logging.getLogger("spacegame")
text_types = ["text/plain", "text/html", "text/javascript", "text/css"]

def application(env, start_response):
  #logging.basicConfig(filename="server_log.txt", level="INFO")
  os.chdir(env['CONTEXT_DOCUMENT_ROOT'])
  
  output = ""
  content_type = ""
  status = '200 OK'
  logger.log(env, "Got a {0} request for URI {1}".format(env["REQUEST_METHOD"], env["REQUEST_URI"]))

  output,status,content_type,extra_headers = uri.process_uri(env["REQUEST_URI"], env)
  
  if content_type.lower() in text_types:
    output = output.encode('utf-8')

  response_headers = [('Content-type', content_type),
                      ('Content-length', str(len(output)))]
  response_headers += extra_headers

  start_response(status, response_headers)

  return [output]
