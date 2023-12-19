// const MONGO_HOST =
//   process.env.CHAT_MONGO_HOST || "k1q26.pub-vpc.mg.naverncp.com";
// const MONGO_PORT = process.env.CHAT_MONGO_HOST || 27017;
const dbName = "koguma";

const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.CHAT_MONGO_HOST,
    // `mongodb://test:a1s2d3!!@k1q26.pub-vpc.mg.naverncp.com:27017/kogumong?directConnection=true&readPreference=primary&authSource=kogumong`
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }
  )
  .then(() => console.log(`MongoDB 연결성공`))
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
