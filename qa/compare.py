from PIL import Image
from pathlib import Path
root=Path('qa')
a=Image.open(r'C:/Users/joelk/AppData/Local/Temp/codex-clipboard-c9b5e4fb-a13f-4d82-a71f-dbd8a3b99592.jpg').convert('RGB')
width=a.width
items=[]
for name in ['desktop-hero.png','programs-desktop.png','journal-desktop.png']:
 im=Image.open(root/name).convert('RGB'); im=im.resize((width,round(im.height*width/im.width)));items.append(im)
board=Image.new('RGB',(width*2,max(a.height,sum(i.height for i in items))),(247,247,239));board.paste(a,(0,0));y=0
for im in items:board.paste(im,(width,y));y+=im.height
board.save(root/'comparison.jpg',quality=90)
print('Reference:',a.size)
for path in root.glob('*.png'):
 print(path.name,Image.open(path).size)
