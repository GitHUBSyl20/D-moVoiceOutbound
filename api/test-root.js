// Test endpoint to see if we can serve HTML from API function
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  console.log('=== TEST ROOT HANDLER ===');
  console.log('Attempting to serve index.html');
  
  // Try multiple paths to find index.html
  const possiblePaths = [
    path.join(__dirname, '../public/index.html'),
    path.join(process.cwd(), 'public/index.html'),
    './public/index.html'
  ];
  
  for (const testPath of possiblePaths) {
    console.log(`Trying path: ${testPath}`);
    try {
      if (fs.existsSync(testPath)) {
        console.log(`✓ Found index.html at: ${testPath}`);
        const html = fs.readFileSync(testPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      }
    } catch (err) {
      console.log(`✗ Error at ${testPath}:`, err.message);
    }
  }
  
  // If we get here, file wasn't found
  console.log('✗ Could not find index.html in any location');
  res.status(404).json({
    error: 'index.html not found',
    checkedPaths: possiblePaths,
    cwd: process.cwd(),
    dirname: __dirname
  });
};

