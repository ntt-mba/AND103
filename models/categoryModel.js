const mongoose = require("mongoose");
//schema = collection
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const category = new schema({
    id: { type: ObjectId },
    name: { type: String },
});

module.exports = mongoose.model.category || mongoose.model("category", category);