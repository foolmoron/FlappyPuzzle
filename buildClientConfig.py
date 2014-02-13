# Reads all the .js files in this directory (and sub-directories) and includes them into the ClientConfig file
import os
import string

FILES_TO_SKIP = [ "game.js", "ClientConfig.js" ]
FILES_TO_END_LIST_WITH = [ "client.js", "load.js", "../howler/howler.min.js", "index.js" ]

with open("ClientConfig.js", "w+") as fileOut:
	#write header
	fileOut.write(\
"""var igeClientConfig = {
	include: [""")
	#write everything else
	for dir, d, files in os.walk("."):
		for file in files:
			if file.endswith(".js") and file not in FILES_TO_SKIP and file not in FILES_TO_END_LIST_WITH:
				 fileOut.write("\n		'" + string.replace(os.path.join(dir, file),"\\", "/") + "',")
	#write footer
	for file in FILES_TO_END_LIST_WITH:
		fileOut.write("\n		'" + file + "',")
	fileOut.write(\
"""
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }""")
