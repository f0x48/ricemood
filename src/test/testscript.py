#!/usr/bin/env python
import re
file = open('/home/fhadiel/.fehbg').read()
wall = re.search("--bg[-\w]+ '(.*?)'",file)
print(wall.group(1))