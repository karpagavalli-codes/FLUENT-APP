#!/usr/bin/env python3
"""
FLUENT Application Development & Runtime Server
Handles port conflicts, SO_REUSEADDR socket binding, automatic port fallback,
and reliable startup for desktop/browser launch.
"""
import http.server
import socketserver
import socket
import sys
import os
import urllib.request
import webbrowser

PREFERRED_PORT = 8080
HOST = "127.0.0.1"

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def is_fluent_running(port):
    try:
        url = f"http://{HOST}:{port}/index.html"
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=1) as resp:
            return resp.status == 200
    except Exception:
        return False

def find_available_port(start_port=8080, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind((HOST, port))
                return port
            except OSError:
                if is_fluent_running(port):
                    print(f"[FLUENT] App is already running on http://{HOST}:{port}")
                    return port
                continue
    return start_port

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = find_available_port(PREFERRED_PORT)
    
    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({
        '.manifest': 'text/cache-manifest',
        '.json': 'application/json',
        '.webmanifest': 'application/manifest+json',
        '.svg': 'image/svg+xml',
    })

    try:
        with ReusableTCPServer((HOST, port), Handler) as httpd:
            print(f"==================================================")
            print(f"  FLUENT App Server Active")
            print(f"  URL: http://{HOST}:{port}")
            print(f"==================================================")
            sys.stdout.flush()

            # Automatically launch browser if requested or standalone
            if "--open" in sys.argv:
                webbrowser.open(f"http://{HOST}:{port}")

            httpd.serve_forever()
    except OSError as e:
        if e.errno == 10048: # Address already in use
            print(f"[FLUENT Notice] Port {port} in use. Existing server active.")
        else:
            print(f"[FLUENT Error] Server startup error: {e}")

if __name__ == "__main__":
    run_server()
