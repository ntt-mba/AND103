const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const product = new schema({
    id: { type: ObjectId },
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    category: { type: ObjectId, ref: "category" }
});
module.exports = mongoose.model.product || mongoose.model("product", product);