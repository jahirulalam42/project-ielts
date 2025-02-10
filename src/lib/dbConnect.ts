const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/ielts", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: any) => {
    console.error("Error connecting to MongoDB:", error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
});

const Person = mongoose.model("Person", personSchema);

const person1 = new Person({ name: "john", age: 19 });

(async () => {
  await person1.save();
})();
