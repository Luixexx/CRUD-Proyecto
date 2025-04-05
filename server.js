// Importamos las dependencias necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware para parsear los datos JSON
app.use(express.json());
app.use(cors());

// Definir la conexión a MongoDB
mongoose.connect("mongodb+srv://admin:jesus1212@luis1234.k89yycy.mongodb.net/crudDB?retryWrites=true&w=majority&appName=luis1234", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// Crear un esquema y un modelo para los usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  edad: { type: Number, required: true },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta para obtener todos los usuarios (GET)
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Hubo un error al obtener los usuarios' });
  }
});

// Ruta para agregar un nuevo usuario (POST)
app.post('/usuarios', async (req, res) => {
  const { nombre, email, edad } = req.body;
  const nuevoUsuario = new Usuario({ nombre, email, edad });

  try {
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario); // Responder con el usuario creado
  } catch (err) {
    res.status(400).json({ error: 'Error al crear el usuario' });
  }
});

// Ruta para actualizar un usuario (PUT)
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, edad } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { nombre, email, edad }, { new: true });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Ruta para eliminar un usuario (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Definir el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
