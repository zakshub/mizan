from pathlib import Path

paths = [
    Path(r"E:\move back to d\check gbs\Zak Live Drive\OneDrive\00 Work\Zuhaib.akram@live.com Drive\OneDrive\Documents\Mizan - Decision Room\node_modules\next\dist\compiled\next-server"),
    Path(r"E:\Google Drive Backup\00 - Original - Zak Gmail\00 - Backups\autobots - projects\mizan\node_modules\next\dist\compiled\next-server"),
]
for p in paths:
    print("PATH", p)
    print("exists", p.exists())
    if p.exists():
        for child in sorted(p.iterdir(), key=lambda x: x.name.lower())[:20]:
            print(" -", child.name)
