import express from 'express';
import mongoose from 'mongoose'; // Ensure mongoose is imported
import { DB_NAME } from './constants.js'; // Ensure DB_NAME is imported
import dotenv from 'dotenv';
import connectDB from './db/index.js';
dotenv.config({
  path: './.env',
});

const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     app.on('error', (error) => {
//       console.log('ERROR: ', error);
//       throw error;
//     });

//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`App is listening on port ${process.env.PORT || 8000}`);
//     });
//   } catch (error) {
//     console.error('ERROR: ', error);
//     process.exit(1); // Standard practice to exit on DB failure
//   }
// })();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!! ', err);
  });
