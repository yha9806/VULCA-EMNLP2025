#!/usr/bin/env python3
"""
UTF-8 aware HTTP server for VULCA exhibition platform
Ensures JavaScript files are served with proper charset
"""
import http.server
import socketserver

class UTF8HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        # Override mime type guessing to add charset=utf-8 for JS files
        mimetype, encoding = http.server.SimpleHTTPRequestHandler.guess_type(self, path)
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8', encoding
        return mimetype, encoding

PORT = 9999
Handler = UTF8HTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"[OK] UTF-8 HTTP Server running at http://localhost:{PORT}/")
    print("[OK] JavaScript files will be served with charset=utf-8")
    httpd.serve_forever()
