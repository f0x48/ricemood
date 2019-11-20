## run ```ricemood -a``` to generate config file    
Ricemood configuration file is located at :
`~/.config/ricemood/ricemood.ini`

Example `ricemood.ini`

```ini
; both are RegExp
tag_start = \^r
tag_end   = \^

; built in script to get wallpaper 
; $feh, $nitrogen
imagefile = $nitrogen
; imagefile_script = getmybg

[const]
; you can add variables here
; you can define that like this "@bg"
bg = '@DM>l(15)'
fg = '@V>l(80)'

;here is the configuration for config file that gonna be parsed
[kitty]
filename = kitty.conf
realfilepath = /home/fhadiel/.config/kitty/ricemood-theme.conf

[i3]
filename = i3.conf
realfilepath = /home/fhadiel/.config/i3/config
```

Example directory structure :  
`~/.config/ricemood/`

```
/home/fhadiel/.config/ricemood
├── getmybg < example script to get background
├── i3.conf < template for i3 config
├── kitty.conf < template for kitty terminal
└── ricemood.ini < ricemood config file
```

Example configuration file:  
`kitty.conf`

```javascript
background ^r@bg^
foreground ^r@V>l(80)^

cursor ^r@LV^

selection_background ^r@V>li(0.2)^
selection_foreground ^r@V>ne^

color0  ^r@DM>da(0.1)^
color8  ^r@DM>da(0.2)^

color1  ^r@V>l(60)^
color9  ^r@V>l(70)^

color2  ^r@V>ro(10)^
color10 ^r@V>ro(10)>li(0.2)^

color3  ^r@DV>^
color11 ^r@DV>li(0.1)^

color4  ^r@M^
color12 ^r@M>li(0.1)^

color5  ^r@LV>ro(30)^
color13 ^r@LV>ro(20)>li(0.1)^

color6  ^r@V>ro(45)>da(0.3)^
color14 ^r@V>ro(45)>da(0.2)^

color7  ^r@V>ro(350)^
color15 ^r@V>ro(350)>li(0.2)^
```

`i3.conf`

```javascript
...
# class                 border   bground  text        indicator child_border
client.focused          ^r@V^   ^r@V^     ^r@V>ttc^   ^r@LV^    ^r@V^
client.focused_inactive ^r@bg^  ^r@bg^    ^r@bg>ttc^  ^r@DV^    ^r@DM^
client.unfocused        ^r@bg^  ^r@bg^    ^r@V^       ^r@DV^    ^r@DM^
client.urgent           ^r@LV^  ^r@bg^    ^r@bg>ttc^  ^r@DV^    ^r@LV^
client.placeholder      ^r@bg^  ^r@bg^    ^r@bg>ttc^  ^r@DV^    ^r@DM^

client.background       ^r@V^

bar {
  strip_workspace_numbers yes
  status_command SCRIPT_DIR=[redacted] i3blocks
  colors {
    background ^r@bg^
    statusline ^r@LM^
    separator  ^r@DM^

    focused_workspace  ^r@V^    ^r@V^       ^r@V>ttc^
    active_workspace   ^r@bg^   ^r@bg^      ^r@V^
    inactive_workspace ^r@bg^   ^r@bg^      ^r@LM^
    urgent_workspace   ^r@bg^   ^r@LV^      ^r@LV>ttc^
    binding_mode       ^r@bg^   ^r@LV^      ^r@LV>ttc^
  }
}
```
```getmybg```
```python 
#!/usr/bin/env python
import re
file = open('/home/fhadiel/.fehbg').read()
wall = re.search("--bg[-\w]+ '(.*?)'",file)
print(wall.group(1) 
```