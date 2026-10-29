require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./src/app');

const MONGO_URI = process.env.MONGODB_URI;
const PORT = Number(process.env.PORT || 3004);

async function start() {
  try {
    if (!MONGO_URI) {
      throw new Error(
        'MONGODB_URI is missing. Create a .env file in the project root and add MONGODB_URI.'
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log(
      `✅ MongoDB connected (${mongoose.connection.name})`
    );

    const server = app.listen(PORT, () => {
      console.log(
        `✅ OmniChannel Customer & Account Service listening on port ${PORT}`
      );
      console.log(
        `Health: http://localhost:${PORT}/health`
      );
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `❌ Port ${PORT} is already in use.`
        );
        process.exit(1);
      }

      console.error('❌ Server error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error(
      '❌ Platform,health and documents service startup failed:',
      err.message
    );

    process.exit(1);
  }
}

start();