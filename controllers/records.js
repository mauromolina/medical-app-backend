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
      code: "GET_RECORDS_ERROR",
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
      record: newRecord,
      code: "RECORD_CREATED",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      code: "CREATE_RECORD_ERROR",
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
        code: "RECORD_NOT_EXISTS",
      });
    if (record.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        code: "UNAUTH_ACTION",
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
      record: updatedRecord,
      code: "RECORD_UPDATED",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      code: "UPDATE_RECORD_ERROR",
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
        code: "RECORD_NOT_EXISTS",
      });
    if (record.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        code: "UNAUTH_ACTION",
      });
    await Record.findByIdAndDelete(recordId);
    res.status(200).json({
      ok: true,
      code: "DELETED_RECORD",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      code: "DELETE_RECORD_ERROR",
    });
  }
};

module.exports = { getRecords, newRecord, updateRecord, deleteRecord };
