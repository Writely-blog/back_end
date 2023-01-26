import app from './index.js';
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3030;

const start = () => {
  try {
    app.listen(port, () => console.log(`Server is listening on ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
