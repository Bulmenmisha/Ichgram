import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            default: '',
            maxlength: 2200,
        },
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;