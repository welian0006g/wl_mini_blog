var mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    user_id: {type: String, required: true},
    user_name: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
