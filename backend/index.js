import express from "express";
import mongoose from "mongoose";

const app = express();

const dbURI = "mongodb://mongo:27017/empresas";
const PORT = 4000;

app.use(express.json());

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definimos un esquema y modelo de Mongoose
const EmpresaSchema = new mongoose.Schema({
  name: String,
  description: String,
  // Agrega más campos según sea necesario
});

const Empresa = mongoose.model("Empresa", EmpresaSchema);

// Crear (Create)
app.post("/empresas", async (req, res) => {
  try {
    const newEmpresa = new Empresa(req.body);
    const savedEmpresa = await newEmpresa.save();
    res.status(201).send(savedEmpresa);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Leer (Read)
app.get("/empresas", async (req, res) => {
  try {
    const empresas = await Empresa.find({});
    res.status(200).send(empresas);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Leer por ID (Read by ID)
app.get("/empresas/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).send("Empresa no encontrada");
    res.status(200).send(empresa);
  } catch (error) {
    res.status(500).send(error);
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
    if (!updatedEmpresa) return res.status(404).send("Empresa no encontrada");
    res.status(200).send(updatedEmpresa);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Eliminar (Delete)
app.delete("/empresas/:id", async (req, res) => {
  try {
    const deletedEmpresa = await Empresa.findByIdAndDelete(req.params.id);
    if (!deletedEmpresa) return res.status(404).send("Empresa no encontrada");
    res.status(200).send(deletedEmpresa);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
