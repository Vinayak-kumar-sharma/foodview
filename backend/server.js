// server start
import app from './src/app.js';
import {connectDb} from './src/db/db.js'
import { createTable } from './src/models/user.model.js';
import { foodPartner } from './src/models/foodpartner.model.js';
import { foodItem } from './src/models/food.model.js';

await connectDb()
await createTable()
await foodPartner()
await foodItem()
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000');
});