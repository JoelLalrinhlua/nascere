from pathlib import Path
from html.parser import HTMLParser
class Check(HTMLParser):
 def __init__(self):super().__init__();self.h1=0;self.title=False;self.meta={};self.text=''
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='h1':self.h1+=1
  if t=='meta':self.meta[a.get('name',a.get('property'))]=a.get('content')
 def handle_data(self,d):self.text+=d
pages=list(Path('dist').rglob('index.html'))
for p in pages:
 c=Check();c.feed(p.read_text(encoding='utf-8'));assert c.h1==1,(p,c.h1);assert '\ufffd' not in c.text,p;assert c.meta.get('description'),p
print(f'PASS: {len(pages)} prerendered routes, each with one H1, metadata and valid text.')
assert 'Keyboard, rhythm' in Path('dist/programs/music/index.html').read_text(encoding='utf-8')
assert Path('dist/sitemap.xml').read_text().count('<url>')==14
assert 'Little toys.' in Path('dist/toys/index.html').read_text(encoding='utf-8')
assert 'noindex' in Path('dist/admin/index.html').read_text(encoding='utf-8')
assert '/admin/' not in Path('dist/sitemap.xml').read_text(encoding='utf-8')
print('PASS: Music-specific metadata, toy catalogue, private admin entry and 14 sitemap URLs.')
