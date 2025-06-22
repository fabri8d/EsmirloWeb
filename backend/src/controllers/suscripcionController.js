const crearSuscripcion = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email requerido' });
  }

  try {
    // Obtener dataSource desde la app
    const dataSource = req.app.get("dataSource");
    const repo = dataSource.getRepository("Suscripcion");

    const existente = await repo.findOneBy({ email });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya estás suscripto con este correo' });
    }

    const nueva = repo.create({ email });
    await repo.save(nueva);

    return res.status(201).json({ mensaje: 'Suscripción guardada', data: nueva });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al guardar la suscripción' });
  }
};

module.exports = { crearSuscripcion };
