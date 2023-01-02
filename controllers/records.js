const Record = require("../models/Record");

const getRecords = async (req, res) => {
  const userId = req.uid;
  try {
    const records = await Record.find({ user: userId })
      .populate("user", "name")
      .sort({ start: 1 });
    res.status(200).json({
      ok: true,
      records,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

const newRecord = async (req, res) => {
  const record = new Record(req.body);

  try {
    record.user = req.uid;
    const newRecord = await record.save();
    res.status(201).json({
      ok: true,
      msg: "Record created",
      record: newRecord,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error al crear nuevo registro",
    });
  }
};

const updateRecord = async (req, res) => {
  const uid = req.uid;
  const recordId = req.params.id;

  try {
    const record = await Record.findById(recordId);
    if (!record)
      return res.status(404).json({
        ok: false,
        msg: "El registro no existe",
      });
    if (record.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        msg: "No tienes privilegios para editar este registro",
      });
    const newRecord = {
      ...req.body,
      user: uid,
    };
    const updatedRecord = await Record.findByIdAndUpdate(recordId, newRecord, {
      new: true,
    });
    res.status(202).json({
      ok: true,
      msg: "Registro actualizado correctamente",
      record: updatedRecord,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar registro",
    });
  }
};

const deleteRecord = async (req, res) => {
  const uid = req.uid;
  const recordId = req.params.id;
  try {
    const record = await Record.findById(recordId);
    if (!record)
      return res.status(404).json({
        ok: false,
        msg: "El registro no existe",
      });
    if (record.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        msg: "No tienes permisos para eliminar este registro",
      });
    await Record.findByIdAndDelete(recordId);
    res.status(200).json({
      ok: true,
      msg: "Registro eliminado correctamente.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor al eliminar registro. Intente nuevamente.",
    });
  }
};

module.exports = { getRecords, newRecord, updateRecord, deleteRecord };
