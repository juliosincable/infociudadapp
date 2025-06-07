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

mongoose.connect(dbURI)
    .then(() => console.log("Conexión a la base de datos exitosa"))
    .catch((error) => {
        console.error("ERROR CRÍTICO: Conexión a la base de datos fallida:", error);
        // process.exit(1);
    });

// Definimos un esquema y modelo de Mongoose
const EmpresaSchema = new mongoose.Schema({
    nombre: { type: String, trim: true },
    direccion: { type: String, trim: true },
    categoria: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    instagram: { type: String, trim: true },
}, { timestamps: true });

// **AQUÍ ESTÁ EL CAMBIO CRUCIAL: Configuración para transformar _id a id**
EmpresaSchema.set('toJSON', {
    virtuals: true, // Incluir propiedades virtuales (como 'id')
    transform: (doc, ret) => {
        ret.id = ret._id; // Mapea _id a id
        delete ret._id;   // Elimina _id (opcional, pero buena práctica si solo quieres 'id')
        delete ret.__v;   // Elimina la versión (__v)
    }
});

const Empresa = mongoose.model("Empresa", EmpresaSchema);

const apiRouter = express.Router();

// Ruta para crear una empresa
apiRouter.post("/empresas", async (req, res) => {
    try {
        console.log("Datos recibidos en el backend (req.body):", req.body);
        const newEmpresa = new Empresa(req.body);
        const savedEmpresa = await newEmpresa.save();
        res.status(201).json(savedEmpresa);
    } catch (error) {
        console.error("Error detallado al crear empresa:", error.message);
        console.error("Stack trace del error:", error.stack);
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ error: "Error de validación de datos", details: errors });
        }
        res.status(500).json({ error: "Error interno del servidor al crear empresa." });
    }
});

// Ruta para obtener todas las empresas
apiRouter.get("/empresas", async (_req, res) => {
    try {
        const empresas = await Empresa.find({});
        // Las empresas serán automáticamente transformadas a JSON con 'id' en lugar de '_id'
        res.status(200).json(empresas);
    } catch (error) {
        console.error("Error al obtener empresas:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener empresas." });
    }
});

// Ruta para obtener una empresa por ID
apiRouter.get("/empresas/:id", async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.params.id);
        if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
        // La empresa será automáticamente transformada a JSON con 'id' en lugar de '_id'
        res.status(200).json(empresa);
    } catch (error) {
        console.error("Error al obtener empresa por ID:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener empresa." });
    }
});

// Ruta para actualizar una empresa por ID
apiRouter.put("/empresas/:id", async (req, res) => {
    try {
        const updatedEmpresa = await Empresa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEmpresa) return res.status(404).json({ error: "Empresa no encontrada" });
        // La empresa actualizada será automáticamente transformada a JSON con 'id' en lugar de '_id'
        res.status(200).json(updatedEmpresa);
    } catch (error) {
        console.error("Error al actualizar empresa:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar empresa." });
    }
});

// Ruta para eliminar una empresa por ID
apiRouter.delete("/empresas/:id", async (req, res) => {
    try {
        // Aquí no necesitas la transformación, ya que solo necesitas el ID para la operación de eliminación
        const deletedEmpresa = await Empresa.findByIdAndDelete(req.params.id);
        if (!deletedEmpresa) return res.status(404).json({ error: "Empresa no encontrada" });
        res.status(200).json({ message: "Empresa eliminada exitosamente." }); // Mensaje de éxito más claro
    } catch (error) {
        console.error("Error al eliminar empresa:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar empresa." });
    }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});