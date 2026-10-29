const express = require('express');


const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'omnichannel-platform-health-documents-service',
    port: Number(process.env.PORT || 3010),
  });
});



module.exports = app;