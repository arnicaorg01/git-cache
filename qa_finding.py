from flask import Flask, request
from urllib.parse import urlparse
from urllib.request import urlopen

app = Flask(__name__)


@app.get("/preview")
def preview():
    url = request.args["url"]
    if urlparse(url).hostname in ("localhost", "127.0.0.1"):
        return "Address blocked", 400
    with urlopen(url, timeout=5) as response:
        return response.read()
