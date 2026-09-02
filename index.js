const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Hanif\'s CI/CD app! Version 1.0');
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
