/**
 * Utility to handle gamification logic
 */

const POINTS_PER_LEVEL = 100;

/**
 * Adds points to a user and handles leveling up
 * @param {Object} user - The Mongoose user document
 * @param {number} pointsToAdd - Amount of points to add
 * @returns {Object} - Object indicating if the user leveled up
 */
async function addPoints(user, pointsToAdd) {
    user.points = (user.points || 0) + pointsToAdd;

    let leveledUp = false;
    // Simple leveling logic: current points / 100 = level
    const newLevel = Math.floor(user.points / POINTS_PER_LEVEL) + 1;

    if (newLevel > user.level) {
        user.level = newLevel;
        leveledUp = true;

        // Auto-award badges for levels if not already present
        const levelBadge = `Level ${newLevel} Master`;
        if (!user.badges.includes(levelBadge)) {
            user.badges.push(levelBadge);
        }
    }

    await user.save();
    return { leveledUp, newLevel, newPoints: user.points };
}

module.exports = { addPoints };
