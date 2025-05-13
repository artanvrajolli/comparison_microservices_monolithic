// Import all models
require('./User');
require('./Blog');
require('./Comment');

// Export models
module.exports = {
    User: require('./User'),
    Blog: require('./Blog'),
    Comment: require('./Comment')
}; 