const RsvpRepository = require('../repositories/rsvp.repository');
const RsvpService = require('../services/rsvp.service');

// Initialize repository and service
const rsvpRepository = new RsvpRepository();
const rsvpService = new RsvpService(rsvpRepository);

class RsvpController {
  /**
   * Submit RSVP response
   */
  async submit(req, res) {
    try {
      const savedRsvp = await rsvpService.submitRsvp(req.body);
      return res.status(201).json({
        success: true,
        message: 'RSVP submitted successfully!',
        data: savedRsvp,
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error.message);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit RSVP.',
      });
    }
  }

  /**
   * Get recent public wishes
   */
  async getWishes(req, res) {
    try {
      const wishes = await rsvpService.getWishes();
      return res.status(200).json({
        success: true,
        data: wishes,
      });
    } catch (error) {
      console.error('Error fetching wishes:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch wishes.',
      });
    }
  }

  /**
   * Middleware to authorize Admin access using headers
   */
  authorizeAdmin(req, res, next) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const clientPassword = req.headers['x-admin-password'];

    if (!clientPassword || clientPassword !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Invalid admin passcode.',
      });
    }
    next();
  }

  /**
   * Get all RSVP submissions (Admin only)
   */
  async getAll(req, res) {
    try {
      const list = await rsvpService.getAllRsvps();
      return res.status(200).json({
        success: true,
        data: list,
      });
    } catch (error) {
      console.error('Error fetching RSVP list:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve RSVP data.',
      });
    }
  }

  /**
   * Get RSVP aggregation stats (Admin only)
   */
  async getStats(req, res) {
    try {
      const stats = await rsvpService.getSummaryStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to compile RSVP statistics.',
      });
    }
  }
}

module.exports = new RsvpController();
