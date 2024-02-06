const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORDS>', process.env.PASSWORDS);

(async () => {
  await mongoose.connect(DB)
})().then(() => console.log("connect success")).catch("some thing not connect")

 
const port = 3000; 
const server = app.listen(port, 'localhost', () => {
  console.log(`Open on port ${port} success!! >>>>`);
}) 

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); 
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');   
  });
})
  