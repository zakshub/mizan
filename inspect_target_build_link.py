from pathlib import Path

p = Path(r"E:\Google Drive Backup\00 - Original - Zak Gmail\00 - Backups\autobots - projects\mizan\.next")
print("exists", p.exists())
print("is_dir", p.is_dir())
print("is_symlink", p.is_symlink())
