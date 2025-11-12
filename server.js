const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  // 默认提供 index.html，如果没有则提供 gomoku.html
  let filePath = req.url === '/' ? '/gomoku.html' : req.url;
  filePath = path.join(process.cwd(), filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = ext === '.html' ? 'text/html' : 
                         ext === '.css' ? 'text/css' :
                         ext === '.js' ? 'application/javascript' : 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});