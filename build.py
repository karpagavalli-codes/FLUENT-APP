#!/usr/bin/env python3
"""
FLUENT - Production Asset Build & Packaging Script
Copies static HTML, CSS, JS modules, icons, manifest, service worker, and 404 routing fallback
into the production ./dist output directory ready for static hosting and GitHub Pages.
"""
import os
import shutil
import sys

def build():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(root_dir, 'dist')

    print(f"[FLUENT Build] Building production bundle in {dist_dir}...")

    # Clean existing dist directory
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)

    os.makedirs(dist_dir)

    # Directories to copy
    dirs_to_copy = ['css', 'js', 'icons']
    for d in dirs_to_copy:
        src = os.path.join(root_dir, d)
        dst = os.path.join(dist_dir, d)
        if os.path.exists(src):
            shutil.copytree(src, dst)
            print(f" -> Copied directory: {d}/")

    # Files to copy
    files_to_copy = ['index.html', '404.html', 'manifest.json', 'sw.js']
    for f in files_to_copy:
        src = os.path.join(root_dir, f)
        dst = os.path.join(dist_dir, f)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f" -> Copied file: {f}")

    print("[FLUENT Build] Production build completed successfully in ./dist!")

if __name__ == '__main__':
    build()
