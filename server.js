/*
 * Combine both Frontend and Backend for production depolyment
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const backendApp = require('./backend/dist/index.js');

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use('/api', backendApp);

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.includes('.')) {
    backendApp(req, res);
  } else {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
