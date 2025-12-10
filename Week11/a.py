import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from collections import deque
import csv
import time

BASE = "https://www.tudienngonngukyhieu.com"
visited = set()
collected = []

def get_links(url):
    try:
        res = requests.get(url, timeout=5)
        soup = BeautifulSoup(res.text, "html.parser")
        return [urljoin(BASE, a["href"]) for a in soup.find_all("a", href=True)]
    except:
        return []

def get_manifest(url):
    # lấy clip_id từ url trang vd: /tu-ngu/dao-dien-7468
    try:
        clip_id = url.split("-")[-1]
        manifest_url = f"{BASE}/manifest/{clip_id}"
        r = requests.get(manifest_url)
        if r.status_code == 200 and "video" in r.text:
            return clip_id, r.json()
    except:
        return None, None
    return None, None

def crawl():
    queue = deque([BASE])
    while queue:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)

        # nếu là link từ vựng -> cố lấy manifest
        if "/tu-ngu/" in url and url.count("/") > 3:
            clip_id, data = get_manifest(url)
            if data:
                collected.append({
                    "page": url,
                    "clip_id": clip_id,
                    "duration": data["video"][0]["duration"],
                    "qualities": [(v["width"], v["height"]) for v in data["video"]],
                    "streams": [v["base_url"] for v in data["video"]],
                })
                print("✔ video:", url)

        # BFS tiếp
        for link in get_links(url):
            if BASE in link and link not in visited:
                queue.append(link)

        time.sleep(0.3)

def save():
    with open("full_video_manifest.csv", "w", newline="", encoding="utf-8") as f:
        fieldnames = ["page", "clip_id", "duration", "qualities", "streams"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(collected)

if __name__ == "__main__":
    crawl()
    save()
    print("🎉 DONE, total collected:", len(collected))
