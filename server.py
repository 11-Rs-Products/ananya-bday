import os
import re
import urllib.parse
import http.server
import socketserver

PORT = 8080

class RangeWrapper:
    def __init__(self, file_obj, length):
        self.file_obj = file_obj
        self.bytes_remaining = length

    def read(self, size=-1):
        if self.bytes_remaining <= 0:
            return b""
        if size < 0 or size > self.bytes_remaining:
            size = self.bytes_remaining
        data = self.file_obj.read(size)
        self.bytes_remaining -= len(data)
        return data

    def close(self):
        self.file_obj.close()

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.translate_path(self.path)
        if path.endswith(('.html', '.js', '.css')):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        """Common code for GET and HEAD commands.
        Sends response code and MIME headers with full Range (206 Partial Content) support.
        """
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                self.send_response(http.HTTPStatus.MOVED_PERMANENTLY)
                new_parts = (parts[0], parts[1], parts[2] + '/', parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(http.HTTPStatus.NOT_FOUND, "File not found")
            return None

        try:
            fs = os.fstat(f.fileno())
            file_len = fs[6]

            # Handle Range Header for smooth seeking (audio/video partial content)
            range_header = self.headers.get('Range')
            if range_header:
                range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
                if range_match:
                    start = int(range_match.group(1))
                    end = int(range_match.group(2)) if range_match.group(2) else file_len - 1

                    if start >= file_len:
                        self.send_error(http.HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE, "Requested Range Not Satisfiable")
                        self.send_header('Content-Range', f'bytes */{file_len}')
                        self.end_headers()
                        f.close()
                        return None

                    end = min(end, file_len - 1)
                    content_len = end - start + 1

                    self.send_response(http.HTTPStatus.PARTIAL_CONTENT)
                    self.send_header('Content-Type', ctype)
                    self.send_header('Content-Range', f'bytes {start}-{end}/{file_len}')
                    self.send_header('Content-Length', str(content_len))
                    self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
                    self.end_headers()

                    f.seek(start)
                    return RangeWrapper(f, content_len)

            self.send_response(http.HTTPStatus.OK)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(file_len))
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except Exception:
            f.close()
            raise

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), RangeHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT} with HTTP Range & Audio Seeking support")
        httpd.serve_forever()
