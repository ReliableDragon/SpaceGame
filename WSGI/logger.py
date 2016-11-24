import logging

logger = logging.getLogger("spacegame")

def log(env, msg):
  logging.basicConfig(filename = env['CONTEXT_DOCUMENT_ROOT'] + "/server_log.txt", level="INFO")
  logger.info(msg)
