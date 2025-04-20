const Publisher = require('../../models/Publisher');

const getAllPublishers = async () => {
    try {
        return await Publisher.find();
    } catch (error) {
        console.error("Error fetching publishers:", error);
        return [];
    }
};

module.exports = {getAllPublishers};