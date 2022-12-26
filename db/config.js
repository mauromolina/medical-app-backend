const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("BD Conectada");
  } catch (err) {
    console.log(err);
    throw new Error("Error al iniciar BD");
  }
};

module.exports = {
  connectDB,
};
