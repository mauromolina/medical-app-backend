const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/config");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());

app.use(express.static("public"));
app.use(express.json());

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/record", require("./routes/records"));

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
