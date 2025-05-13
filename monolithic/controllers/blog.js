const { Blog } = require('../models');

exports.getBlogsWithDetails = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate({
                path: 'author',
                select: 'username email',
                transform: doc => ({
                    id: doc._id,
                    ...doc,
                    _id: undefined,
                    __v: undefined
                })
            })
            .populate({
                path: 'comments',
                transform: doc => ({
                    id: doc._id,
                    ...doc,
                    _id: undefined,
                    __v: undefined
                }),
                populate: {
                    path: 'user',
                    select: 'username email',
                    transform: doc => ({
                        id: doc._id,
                        ...doc,
                        _id: undefined,
                        __v: undefined
                    })
                }
            })
            .lean()
            .transform(docs => docs.map(doc => ({
                id: doc._id,
                ...doc,
                _id: undefined,
                __v: undefined
            })));
        
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};