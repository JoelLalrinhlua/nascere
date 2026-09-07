from pathlib import Path
from PIL import Image,ImageDraw
root=Path('qa')
logo=Image.open('public/assets/nascere-logo.jpg').convert('RGB')
shot=Image.open(root/'brand-desktop.png').convert('RGB')
shot.thumbnail((1050,850))
board=Image.new('RGB',(1280,max(shot.height+50,500)),'white')
d=ImageDraw.Draw(board);d.text((20,15),'SUPPLIED NASCERE LOGO',fill='#242320');board.paste(logo,(30,55));d.text((230,15),'REDESIGNED WEBSITE',fill='#242320');board.paste(shot,(230,50))
for i,(name,color) in enumerate([('Pink','#e82060'),('Yellow','#f5b700'),('Teal','#2eada0'),('Purple','#7c6fe0')]):
 y=235+i*55;d.rectangle((25,y,65,y+35),fill=color);d.text((80,y+10),name,fill='#242320')
board.save(root/'brand-comparison.jpg',quality=94)
for f in ['brand-desktop.png','brand-mobile.png','brand-tablet.png']:
 print(f,Image.open(root/f).size)
