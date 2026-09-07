import urllib.request,re
for p in ['/journal/ideas-on-paper','/journal/ideas-on-paper/','/']:
 s=urllib.request.urlopen('http://127.0.0.1:4174'+p).read().decode();print(p,re.search('<h1[^>]*>(.*?)</h1>',s).group(1))
