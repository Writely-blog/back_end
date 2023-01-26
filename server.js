import app from './index.js';

const start = () => {
  try {
    app.listen(port, () => console.log(`Server is listening on ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
