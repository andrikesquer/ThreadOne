export class ThreadOneControler {
  constructor({ threadOneModel }) {
    this.threadOneModel = threadOneModel;
  }

  getAll = async (req, res) => {
    const usuarios = await this.threadOneModel.getAll();
    res.json(usuarios);
  };

  getById = async (req, res) => {
    const { id_usuario } = req.params;
    const usuario = await this.threadOneModel.getById(id_usuario);
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(usuario);
  };

  create = async (req, res) => {
    const usuario = req.body;
    await this.threadOneModel.create({ req, res });
    res.status(201).json(usuario);
  };

  delete = async (req, res) => {
    const { id_usuario } = req.params;
    await this.threadOneModel.delete({ id_usuario });
    res.status(204).end();
  };

  update = async (req, res) => {
    const { id_usuario } = req.params;
    const input = req.body;
    await this.threadOneModel.update({ id_usuario, input });
    res.status(204).end();
  };
}
