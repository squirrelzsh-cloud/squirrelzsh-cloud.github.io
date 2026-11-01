"""Import exactly the approved public Site snapshot; fail closed on mismatch."""
import concurrent.futures
import hashlib
import json
import pathlib
import shutil
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / 'deployment-manifest.json').read_text())
BASE = 'https://xiaohao-ux-portfolio.squirrelzsh.chatgpt.site/'
SITE = ROOT / 'site'

def digest(data):
    return hashlib.sha256(data).hexdigest()

def prepare(entry, staging):
    relative = pathlib.PurePosixPath(entry['path'])
    if relative.is_absolute() or '..' in relative.parts:
        raise ValueError('Unsafe path')
    destination = staging / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    existing = SITE / relative
    if existing.is_file() and digest(existing.read_bytes()) == entry['sha256']:
        shutil.copyfile(existing, destination)
        return
    url = BASE + urllib.parse.quote(entry['path'], safe='/')
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=90) as response:
                data = response.read()
            if len(data) != entry['size'] or digest(data) != entry['sha256']:
                raise ValueError('Snapshot checksum mismatch: ' + entry['path'])
            destination.write_bytes(data)
            return
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))

def main():
    with tempfile.TemporaryDirectory(prefix='verified-portfolio-') as temp:
        staging = pathlib.Path(temp)
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            list(pool.map(lambda entry: prepare(entry, staging), MANIFEST['files']))
        for entry in MANIFEST['files']:
            path = staging / entry['path']
            assert digest(path.read_bytes()) == entry['sha256'], entry['path']
            if path.suffix in ('.js', '.mjs'):
                subprocess.run(['node', '--check', str(path)], check=True)
        assert (staging / 'index.html').is_file()
        # Only the tracked website payload is replaced after ALL checks pass.
        # Git history retains every previous deployed version.
        old_files = subprocess.check_output(['git', 'ls-files', '-z', 'site'], cwd=ROOT).decode().split('\0')
        expected = {'site/' + entry['path'] for entry in MANIFEST['files']}
        for old in filter(None, old_files):
            if old not in expected:
                (ROOT / old).unlink(missing_ok=True)
        shutil.copytree(staging, SITE, dirs_exist_ok=True)
    print(f"Verified Site v{MANIFEST['version']}: {len(MANIFEST['files'])} files")

if __name__ == '__main__':
    main()
