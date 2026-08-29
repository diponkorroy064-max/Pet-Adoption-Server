const userService = require('./user.service');

// Get User Profile---
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserFromDB(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User profile fetched successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user profile'
        });
    }
};

// Update User Profile---
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent updating read-only fields---
        delete updateData._id;
        delete updateData.email;

        const result = await userService.updateUserInDB(id, updateData);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found or update failed'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user profile'
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
