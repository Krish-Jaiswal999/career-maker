import urllib.request, hashlib, sys, os
local_path = os.path.join('frontend','js','portfolio.js')
served_url = 'http://localhost:3000/js/portfolio.js'

def sha256(data):
    return hashlib.sha256(data).hexdigest()

try:
    with open(local_path,'rb') as f:
        local = f.read()
except Exception as e:
    print('LOCAL_READ_ERROR', e)
    sys.exit(2)

try:
    r = urllib.request.urlopen(served_url, timeout=5)
    served = r.read()
except Exception as e:
    print('FETCH_ERROR', e)
    sys.exit(3)

print('LOCAL_len', len(local), 'sha256', sha256(local))
print('SERVED_len', len(served), 'sha256', sha256(served))

if local == served:
    print('MATCH: served file identical to local file')
    sys.exit(0)

print('MISMATCH: differences detected')
print('\n-- local head (200) --')
print(local[:200].decode('utf-8',errors='replace'))
print('\n-- served head (200) --')
print(served[:200].decode('utf-8',errors='replace'))
print('\n-- local tail (200) --')
print(local[-200:].decode('utf-8',errors='replace'))
print('\n-- served tail (200) --')
print(served[-200:].decode('utf-8',errors='replace'))

# Save served copy for manual inspection
with open(os.path.join('tools','served_portfolio.js'),'wb') as f:
    f.write(served)

sys.exit(1)
