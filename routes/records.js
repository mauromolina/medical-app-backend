const { Router } = require("express");
const {
  getRecords,
  newRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/records");
const { checkNewRecord } = require("../middlewares/checkValidation");
const { validateJwt } = require("../middlewares/validateJwt");

const router = Router();

router.use(validateJwt);

router.get("/", getRecords);
router.post("/", checkNewRecord(), newRecord);
router.put("/:id", checkNewRecord(), updateRecord);
router.delete("/:id", deleteRecord);

module.exports = router;
