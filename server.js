const app = require('./src/app/app');
const { client } = require('./src/config/db/mongodb');
const port = process.env.PORT || 2000;

let server;

const bootstrap = async () => {
  try {
    await client.connect();
    console.log("Connected to mondoDb");
    server = app.listen(port, () => {
      console.log(`App is running on port http://localhost:${port}`)
    });
  } catch (error) {
    console.log({ errorMessage: error.message });
  }
};

bootstrap();

module.exports = app;