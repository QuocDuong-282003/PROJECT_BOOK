const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ImageSchema = new Schema(
    {
        bookId: {
            type: ObjectId,
            ref: "Book",
            required: true,
            index: true
        },
        data: {
            type: Buffer,
            required: true
        },
        contentType: {
            type: String,
            required: true
        }
    },
    {
        collection: "images",
        versionKey: false,
        timestamps: true
    }
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;