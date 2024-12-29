const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para analizar JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://mongo:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ruta básica para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('Servidor backend está funcionando correctamente.');
});

// Esquema y modelo de ejemplo
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Rutas CRUD
// Crear (Create)
app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).send(newItem);
});

// Leer (Read)
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.status(200).send(items);
});

// Actualizar (Update)
app.put('/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(updatedItem);
});

// Eliminar (Delete)
app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
