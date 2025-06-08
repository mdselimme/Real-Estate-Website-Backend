import app from "./src/app/app.mjs";
import { client } from "./src/config/db/mongodb.mjs";
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