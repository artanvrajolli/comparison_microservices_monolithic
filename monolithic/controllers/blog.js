const { Blog } = require('../models');

exports.getBlogsWithDetails = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'username email')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username email'
                }
            });
        
        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};