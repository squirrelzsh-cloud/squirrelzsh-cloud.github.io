"""Verify the committed portfolio against its approved source manifest."""
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'deployment-manifest.json').read_text())
for entry in manifest['files']:
    relative = pathlib.PurePosixPath(entry['path'])
    if relative.is_absolute() or '..' in relative.parts:
        raise ValueError('Unsafe path')
    path = ROOT / 'site' / relative
    data = path.read_bytes()
    if len(data) != entry['size'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
        raise ValueError('Snapshot checksum mismatch: ' + entry['path'])
    if path.suffix in ('.js', '.mjs'):
        subprocess.run(['node', '--check', str(path)], check=True)
assert (ROOT / 'site/index.html').is_file()
print(f"Verified Site v{manifest['version']}: {len(manifest['files'])} files")
