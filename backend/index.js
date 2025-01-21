import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 4000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mi_bd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
