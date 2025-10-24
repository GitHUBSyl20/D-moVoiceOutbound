// Catch-all route to serve static files from public folder
const fs = require('fs');
const path = require('path');

// MIME type mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

module.exports = (req, res) => {
  try {
    // Get the requested path
    let requestPath = req.url || '/';
    
    // Remove query string
    requestPath = requestPath.split('?')[0];
    
    // Default to index.html for root
    if (requestPath === '/' || requestPath === '') {
      requestPath = '/index.html';
    }
    
    // Security: prevent directory traversal
    if (requestPath.includes('..')) {
      return res.status(403).send('Forbidden');
    }
    
    // Build file path
    const filePath = path.join(process.cwd(), 'public', requestPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // If file doesn't exist and no extension, try adding .html
      if (!path.extname(requestPath)) {
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) {
          const content = fs.readFileSync(htmlPath, 'utf-8');
          res.setHeader('Content-Type', 'text/html');
          return res.status(200).send(content);
        }
      }
      
      // File not found - serve index.html (SPA fallback)
      const indexPath = path.join(process.cwd(), 'public', 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(content);
      }
      
      return res.status(404).send('Not Found');
    }
    
    // Check if it's a directory
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(content);
      }
      return res.status(403).send('Forbidden');
    }
    
    // Get file extension and set content type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Read and serve the file
    const content = fs.readFileSync(filePath);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    return res.status(200).send(content);
    
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).send('Internal Server Error');
  }
};

