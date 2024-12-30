import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "PORTFOLIO",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      `Some Error while connecting to Database`, err;
    });
};

export default dbConnection;
