import express from "express";
import mongoose from "mongoose";

const app = express();

const dbURI = process.env.MONGODB_URI || "mongodb://mongo:27017/empresas";
const PORT = 4000;

// Configuración de CORS manual
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Conexión a la base de datos exitosa"))
    .catch((error) => console.error("Conexión a la base de datos fallida:", error));

// Definimos un esquema y modelo de Mongoose
// *** LA CORRECCIÓN CLAVE ESTÁ AQUÍ: Hemos eliminado la línea del _id.
const EmpresaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    instagram: { type: String, required: true, trim: true },
}, { timestamps: true }); // Mongoose seguirá añadiendo 'timestamps' automáticamente

const Empresa = mongoose.model("Empresa", EmpresaSchema);

// Crea un nuevo Router de Express para las rutas de la API
const apiRouter = express.Router();

// Define tus rutas de empresas en el apiRouter
apiRouter.post("/empresas", async (req, res) => {
    try {
        const newEmpresa = new Empresa(req.body);
        const savedEmpresa = await newEmpresa.save();
        res.status(201).json(savedEmpresa);
    } catch (error) {
        // Mejorar la respuesta de error para no exponer detalles internos si no es necesario
        console.error("Error al crear empresa:", error);
        res.status(500).json({ error: "Error interno del servidor al crear empresa." });
    }
});

apiRouter.get("/empresas", async (_req, res) => {
    try {
        const empresas = await Empresa.find({});
        res.status(200).json(empresas);
    } catch (error) {
        console.error("Error al obtener empresas:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener empresas." });
    }
});

apiRouter.get("/empresas/:id", async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.params.id);
        if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
        res.status(200).json(empresa);
    } catch (error) {
        console.error("Error al obtener empresa por ID:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener empresa." });
    }
});

apiRouter.put("/empresas/:id", async (req, res) => {
    try {
        const updatedEmpresa = await Empresa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEmpresa) return res.status(404).json({ error: "Empresa no encontrada" });
        res.status(200).json(updatedEmpresa);
    } catch (error) {
        console.error("Error al actualizar empresa:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar empresa." });
    }
});

apiRouter.delete("/empresas/:id", async (req, res) => {
    try {
        const deletedEmpresa = await Empresa.findByIdAndDelete(req.params.id);
        if (!deletedEmpresa) return res.status(404).json({ error: "Empresa no encontrada" });
        res.status(200).json(deletedEmpresa);
    } catch (error) {
        console.error("Error al eliminar empresa:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar empresa." });
    }
});

// Monta el apiRouter en la ruta '/api' de tu aplicación principal
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});