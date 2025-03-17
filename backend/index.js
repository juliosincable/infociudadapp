import express from "express";
import mongoose from "mongoose";

const app = express();

const dbURI = process.env.MONGODB_URI || "mongodb://mongo:27017/empresas";
const PORT = 4000;

app.use(express.json());

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // Esta opción ya no es necesaria en Mongoose 6.x
}).then(() => console.log('Conexión a la base de datos exitosa'))
  .catch((error) => console.error('Conexión a la base de datos fallida:', error));

// Definimos un esquema y modelo de Mongoose
const EmpresaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  nombreEmpresa: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  categoria: { type: String, required: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  instagram: { type: String, required: true, trim: true },
  // Add more fields as needed with appropriate validations
});

const Empresa = mongoose.model("Empresa", EmpresaSchema);

// Crear (Create)
app.post("/empresas", async (req, res) => {
  try {
    const newEmpresa = new Empresa(req.body);
    const savedEmpresa = await newEmpresa.save();
    res.status(201).json(savedEmpresa);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Enviar errores en formato JSON
  }
});

// Leer (Read)
app.get("/empresas", async (_req, res) => {
  try {
    const empresas = await Empresa.find({});
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Enviar errores en formato JSON
  }
});

// Leer por ID (Read by ID)
app.get("/empresas/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
    res.status(200).json(empresa); // Usar res.json en lugar de res.send
  } catch (error) {
    res.status(500).json({ error: error.message }); // Enviar errores en formato JSON
  }
});

// Actualizar (Update)
app.put("/empresas/:id", async (req, res) => {
  try {
    const updatedEmpresa = await Empresa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmpresa) return res.status(404).json({ error: "Empresa no encontrada" });
    res.status(200).json(updatedEmpresa); // Usar res.json en lugar de res.send
  } catch (error) {
    res.status(500).json({ error: error.message }); // Enviar errores en formato JSON
  }
});

// Eliminar (Delete)
app.delete("/empresas/:id", async (req, res) => {
  try {
    const deletedEmpresa = await Empresa.findByIdAndDelete(req.params.id);
    if (!deletedEmpresa) return res.status(404).json({ error: "Empresa no encontrada" });
    res.status(200).json(deletedEmpresa); // Usar res.json en lugar de res.send
  } catch (error) {
    res.status(500).json({ error: error.message }); // Enviar errores en formato JSON
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
