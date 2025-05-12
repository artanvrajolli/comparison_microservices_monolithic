const Blog = require('../models/Blog');

exports.getBlogsWithDetails = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate({
                path: 'author',
                select: 'username email',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username email',
                },
            });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
};