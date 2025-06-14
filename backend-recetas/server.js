const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});


//Prueba
app.get('/ingredientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredientes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});






//Login

//Trae los usuarios
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      // Usuario válido
      res.json({ success: true, usuario: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en servidor' });
  }
});




//Signup
//Crea un nuevo usuario
app.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, premium)
       VALUES ($1, $2, $3, false)
       RETURNING id, nombre, email, premium`,
      [nombre, email, password]
    );

    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error("Error en /registro:", error);
    res.status(500).json({ success: false, message: "Error al registrar usuario" });
  }
});




//Homepage


// Obtener una receta por ID
app.get('/recetas', async (req, res) => {
  const { id, tipo_comida } = req.query;

  try {
    if (id) {
      const result = await pool.query('SELECT * FROM recetas WHERE id = $1', [id]);
      res.json(result.rows);
    } else if (tipo_comida) {
      const result = await pool.query(
        'SELECT * FROM recetas WHERE tipo_comida ILIKE $1',
        [tipo_comida]
      );
      res.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM recetas');
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});


//Get Receta ingredientes y materiales
app.get('/receta_ingredientes/:recetaId', async (req, res) => {
  const { recetaId } = req.params;
  try {
    const result = await pool.query(
      'SELECT nombre, cantidad FROM receta_ingredientes WHERE receta_id = $1',
      [recetaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ingredientes de la receta' });
  }
});

app.get('/receta_materiales/:recetaId', async (req, res) => {
  const { recetaId } = req.params;
  try {
    const result = await pool.query(
      'SELECT material FROM receta_materiales WHERE receta_id = $1',
      [recetaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener materiales de la receta' });
  }
});

//GET recetas por nombre o ingrediente (query param ?q=texto)
app.get('/buscar_recetas', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Falta parámetro de búsqueda q' });

  try {
    const searchText = `%${q.toLowerCase()}%`;
    const result = await pool.query(
      `
      SELECT DISTINCT r.*
      FROM recetas r
      LEFT JOIN receta_ingredientes ri ON r.id = ri.receta_id
      WHERE LOWER(r.nombre) LIKE $1 OR LOWER(ri.nombre) LIKE $1
      `,
      [searchText]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar recetas' });
  }
});


// GET: Ingredientes y materiales del usuario de la despensa
app.get('/despensa/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const result = await pool.query(
      `SELECT nombre FROM ingredientes WHERE usuario_id = $1`,
      [usuarioId]
    );
    res.json(result.rows); // [{ nombre: 'Arroz' }, { nombre: 'Sartén' }, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener despensa completa' });
  }
});

//veces_usada
app.post('/usar_receta/:id', async (req, res) => {
  const recetaId = parseInt(req.params.id);
  const { usuarioId } = req.body;

  if (!recetaId || !usuarioId) {
    return res.status(400).json({ error: 'Faltan datos de usuario o receta' });
  }

  const client = await pool.connect(); // usa pool en lugar de db
  try {
    await client.query('BEGIN');

    // Incrementar veces_usada en recetas
    await client.query(`
      UPDATE recetas
      SET veces_usada = COALESCE(veces_usada, 0) + 1
      WHERE id = $1
    `, [recetaId]);

    // Verificar si ya existe la relación en hist_usuario
    const result = await client.query(`
      SELECT * FROM hist_usuario
      WHERE usuario_id = $1 AND receta_id = $2
    `, [usuarioId, recetaId]);

    if (result.rowCount > 0) {
      // Si ya existe, incrementar
      await client.query(`
        UPDATE hist_usuario
        SET veces_usada = veces_usada + 1
        WHERE usuario_id = $1 AND receta_id = $2
      `, [usuarioId, recetaId]);
    } else {
      // Si no existe, insertar
      await client.query(`
        INSERT INTO hist_usuario (usuario_id, receta_id, veces_usada)
        VALUES ($1, $2, 1)
      `, [usuarioId, recetaId]);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Receta marcada como usada correctamente' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al marcar receta como usada:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    client.release();
  }
});









//Calendario









//Favoritos
//POST receta a favoritos
app.post('/favoritos', async (req, res) => {
  const { usuarioId, recetaId } = req.body;

  try {
    await pool.query(
      'INSERT INTO recetas_favoritas (usuario_id, receta_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [usuarioId, recetaId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
});

//GET recetas favoritas por ID
app.get('/favoritos/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const result = await pool.query(
      `SELECT recetas.id, recetas.nombre
       FROM recetas
       INNER JOIN recetas_favoritas ON recetas.id = recetas_favoritas.receta_id
       WHERE recetas_favoritas.usuario_id = $1`,
      [usuarioId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});


//DELETE receta de favoritos por usuarioId
app.delete('/favoritos/:usuarioId/:recetaId', async (req, res) => {
  const { usuarioId, recetaId } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM recetas_favoritas 
       WHERE usuario_id = $1 AND receta_id = $2`,
      [usuarioId, recetaId]
    );

    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Favorito eliminado' });
    } else {
      res.status(404).json({ success: false, message: 'Favorito no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});



//Despensa
//Materiales
//POST para agregar ingrediente
app.post('/ingredientes', async (req, res) => {
  const { usuario_id, nombre, tipo, unidad, cantidad, caducidad } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ingredientes 
       (usuario_id, nombre, tipo, unidad, cantidad, caducidad)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [usuario_id, nombre, tipo, unidad, cantidad, caducidad]
    );
    res.json({ success: true, ingrediente: result.rows[0] });
  } catch (error) {
    console.error("Error al agregar ingrediente:", error);
    res.status(500).json({ success: false, message: "Error al agregar ingrediente" });
  }
});

//GET ingredientes por usuarioId
app.get('/ingredientes/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const { tipo } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, nombre FROM ingredientes WHERE usuario_id = $1 AND tipo ILIKE $2`,
      [usuarioId, tipo]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ingredientes' });
  }
});

// GET ingrediente por usuarioId e id
app.get('/ingredientes/:usuarioId/:id', async (req, res) => {
  const { usuarioId, id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, nombre, tipo, unidad, cantidad, caducidad 
       FROM ingredientes WHERE usuario_id = $1 AND id = $2`,
      [usuarioId, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Ingrediente no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ingrediente' });
  }
});



//DELETE ingrediente por usuarioId y id
app.delete('/ingredientes/:usuarioId/:id', async (req, res) => {
  const { usuarioId, id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM ingredientes WHERE usuario_id = $1 AND id = $2',
      [usuarioId, id]
    );
    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Ingrediente eliminado' });
    } else {
      res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar ingrediente' });
  }
});


//Maquinas
//POST para agregar máquina
app.post('/maquinas', async (req, res) => {
  const { usuario_id, tipo, modelo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO maquinas (usuario_id, tipo, modelo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [usuario_id, tipo, modelo]
    );
    res.json({ success: true, maquina: result.rows[0] });
  } catch (error) {
    console.error("Error al agregar máquina:", error);
    res.status(500).json({ success: false, message: "Error al agregar máquina" });
  }
});

// GET maquinas por usuarioId
app.get('/maquinas/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const { tipo } = req.query;

  try {
    let result;

    if (tipo) {
      result = await pool.query(
        'SELECT id, tipo, modelo FROM maquinas WHERE usuario_id = $1 AND tipo ILIKE $2',
        [usuarioId, tipo]
      );
    } else {
      result = await pool.query(
        'SELECT id, tipo, modelo FROM maquinas WHERE usuario_id = $1',
        [usuarioId]
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener máquinas' });
  }
});

// GET maquina por usuarioId e id
app.get('/maquinas/:usuarioId/:id', async (req, res) => {
  const { usuarioId, id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, tipo, modelo 
       FROM maquinas WHERE usuario_id = $1 AND id = $2`,
      [usuarioId, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Máquina no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener máquina' });
  }
});



// DELETE maquina por usuarioId y id
app.delete('/maquinas/:usuarioId/:id', async (req, res) => {
  const { usuarioId, id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM maquinas WHERE usuario_id = $1 AND id = $2',
      [usuarioId, id]
    );
    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Máquina eliminada' });
    } else {
      res.status(404).json({ success: false, message: 'Máquina no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar máquina' });
  }
});


//Citas
app.get('/profesionales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profesionales');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
});








//Alergias

//POST alergia
app.post('/alergias', async (req, res) => {
  const { usuario_id, nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alergias (usuario_id, nombre) VALUES ($1, $2) RETURNING *',
      [usuario_id, nombre]
    );
    res.json({ success: true, alergia: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar alergia' });
  }
});

//GET alergias por usuarioId
app.get('/alergias/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, nombre FROM alergias WHERE usuario_id = $1',
      [usuarioId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener alergias' });
  }
});

//DELETE alergia
app.delete('/alergias/:usuarioId/:id', async (req, res) => {
  const { usuarioId, id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM alergias WHERE usuario_id = $1 AND id = $2',
      [usuarioId, id]
    );
    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Alergia eliminada' });
    } else {
      res.status(404).json({ success: false, message: 'Alergia no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar alergia' });
  }
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
