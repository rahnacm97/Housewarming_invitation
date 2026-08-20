const BaseRepository = require('./base.repository');
const Rsvp = require('../models/rsvp.model');

class RsvpRepository extends BaseRepository {
  constructor() {
    super(Rsvp);
  }

  /**
   * Find RSVP by phone number (used to prevent duplicate submissions)
   */
  async findByPhone(phone) {
    return await this.findOne({ phone });
  }

  /**
   * Get all submissions where guest attending is true and they wrote a wish
   */
  async findRecentWishes(limit = 20) {
    return await this.find(
      { attending: true, wish: { $ne: '', $exists: true } },
      { sort: { createdAt: -1 }, limit }
    );
  }

  /**
   * Get aggregated RSVP statistics for the Admin Panel
   */
  async getStats() {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          totalAttending: {
            $sum: { $cond: [{ $eq: ['$attending', true] }, 1, 0] }
          },
          totalDeclined: {
            $sum: { $cond: [{ $eq: ['$attending', false] }, 1, 0] }
          },
          totalGuests: {
            $sum: { $cond: [{ $eq: ['$attending', true] }, '$guests', 0] }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        totalSubmissions: 0,
        totalAttending: 0,
        totalDeclined: 0,
        totalGuests: 0
      };
    }

    return stats[0];
  }
}

module.exports = RsvpRepository;
