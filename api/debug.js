// Diagnostic endpoint to understand Vercel's file system
module.exports = (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  console.log('=== VERCEL DEBUG INFO ===');
  console.log('Request URL:', req.url);
  console.log('Request Path:', req.path);
  console.log('Current Directory:', __dirname);
  console.log('Process CWD:', process.cwd());
  
  const diagnostics = {
    request: {
      url: req.url,
      path: req.path,
      method: req.method,
      headers: req.headers
    },
    paths: {
      __dirname: __dirname,
      'process.cwd()': process.cwd()
    },
    publicFolderCheck: {},
    filesInRoot: []
  };
  
  // Check if public folder exists from different paths
  const pathsToCheck = [
    path.join(__dirname, '../public'),
    path.join(process.cwd(), 'public'),
    './public',
    '/var/task/public'
  ];
  
  pathsToCheck.forEach(testPath => {
    try {
      const exists = fs.existsSync(testPath);
      diagnostics.publicFolderCheck[testPath] = {
        exists,
        contents: exists ? fs.readdirSync(testPath) : null
      };
      console.log(`Path check [${testPath}]:`, exists);
      if (exists) {
        console.log(`  Contents:`, fs.readdirSync(testPath));
      }
    } catch (err) {
      diagnostics.publicFolderCheck[testPath] = { error: err.message };
      console.log(`Path check [${testPath}]: ERROR -`, err.message);
    }
  });
  
  // Check root directory contents
  try {
    diagnostics.filesInRoot = fs.readdirSync(process.cwd());
    console.log('Files in CWD:', diagnostics.filesInRoot);
  } catch (err) {
    diagnostics.filesInRoot = { error: err.message };
  }
  
  console.log('=== END DEBUG INFO ===');
  
  res.status(200).json(diagnostics);
};

