// server start
import app from './src/app.js';
import {connectDb} from './src/db/db.js'
import { createTable } from './src/models/user.model.js';
import { foodPartner } from './src/models/foodpartner.model.js';
import { foodItem } from './src/models/food.model.js';
import { userSaveTable } from './src/models/userSave.model.js';
import { reelLike } from './src/models/like.model.js';
import { commentTable } from './src/models/comment.model.js';
import { createReplieTable } from './src/models/replies.models.js';

await connectDb()
await createTable()
await foodPartner()
await foodItem()
await userSaveTable()
await reelLike()
await commentTable()
await createReplieTable()
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});