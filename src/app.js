const express = require('express');

const retrieveAppRelease = require('./API/retrieveAppRelease/routes/route');
const uploadDocument = require('./API/uploadDocument/routes/route');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'omnichannel-platform-health-documents-service',
    port: Number(process.env.PORT || 3010),
  });
});

app.use('/', retrieveAppRelease);
app.use('/',uploadDocument);

module.exports = app;