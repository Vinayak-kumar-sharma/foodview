// server start
import app from './src/app.js';
import {connectDb} from './src/db/db.js'
import { createTable } from './src/models/user.model.js';

await connectDb()
await createTable();
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000');
});