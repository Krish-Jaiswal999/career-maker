import urllib.request, json, sys

def get(url):
    try:
        r = urllib.request.urlopen(url, timeout=5)
        body = r.read()
        print(f"GET {url} -> {r.status} len={len(body)}")
        return True, body
    except Exception as e:
        print(f"GET {url} -> ERROR: {e}")
        return False, None


def post(url, payload):
    try:
        data = json.dumps(payload).encode()
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        r = urllib.request.urlopen(req, timeout=5)
        body = r.read().decode()
        print(f"POST {url} -> {r.status} body={body}")
        return True, body
    except Exception as e:
        print(f"POST {url} -> ERROR: {e}")
        return False, None


if __name__ == '__main__':
    get('http://localhost:3000/pages/login.html')
    get('http://localhost:3000/js/portfolio.js')
    post('http://localhost:8000/auth/login', {"email": "newtest@example.com", "password": "password123"})
    get('http://localhost:3000/pages/portfolio.html')
