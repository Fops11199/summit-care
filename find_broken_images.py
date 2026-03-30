import glob, re, os, urllib.request

files = glob.glob('*.html') + glob.glob('*.css') + glob.glob('*.js')

broken = []
for f in files:
    with open(f, encoding='utf-8') as file:
        content = file.read()
    
    # Find src="...", src='...', url("..."), url('...')
    matches = re.findall(r'src=[\"\']([^\"\']+)[\"\']|url\([\"\']?([^\"\'\)]+)[\"\']?\)', content)
    for m in matches:
        url = m[0] or m[1]
        
        # ignore data URIs or empty
        if not url or url.startswith('data:'):
            continue
            
        if url.startswith('http'):
            try:
                # Basic check for remote URLs
                req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
                urllib.request.urlopen(req, timeout=5)
            except Exception as e:
                broken.append((f, url, str(e)))
        else:
            # local file check
            if not os.path.exists(url):
                broken.append((f, url, "File not found locally"))

if not broken:
    print("No broken images found.")
else:
    for b in broken:
         print(f"File: {b[0]} | Broken URL: {b[1]} | Error: {b[2]}")
