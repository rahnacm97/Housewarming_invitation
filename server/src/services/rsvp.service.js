/**
 * Service Layer responsible for business logic.
 * Decouples controller logic from repository logic.
 */
class RsvpService {
  constructor(rsvpRepository) {
    this.rsvpRepository = rsvpRepository;
  }

  /**
   * Submit or update an RSVP.
   * If an RSVP with the phone number exists, it will be updated.
   */
  async submitRsvp(rsvpData) {
    const { name, phone, email, attending, guests, wish } = rsvpData;

    // Validate inputs
    if (!name || !name.trim()) {
      throw new Error('Name is required.');
    }
    if (!phone || !phone.trim()) {
      throw new Error('Phone number is required.');
    }
    if (attending === undefined) {
      throw new Error('Attendance response is required.');
    }

    // Process attributes based on attendance status
    const isAttending = !!attending;
    const guestCount = isAttending ? Math.max(1, parseInt(guests) || 1) : 0;
    const sanitizedWish = wish ? wish.trim() : '';

    // Check if RSVP exists by phone
    const existingRsvp = await this.rsvpRepository.findByPhone(phone.trim());

    const updatePayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      attending: isAttending,
      guests: guestCount,
      wish: sanitizedWish,
    };

    if (existingRsvp) {
      return await this.rsvpRepository.update({ phone: phone.trim() }, updatePayload);
    } else {
      return await this.rsvpRepository.create(updatePayload);
    }
  }

  /**
   * Get public wishes to display on the wall.
   */
  async getWishes() {
    return await this.rsvpRepository.findRecentWishes(30);
  }

  /**
   * Get all RSVP submissions (Admin only).
   */
  async getAllRsvps() {
    return await this.rsvpRepository.find({}, { sort: { createdAt: -1 } });
  }

  /**
   * Get RSVP stats summary (Admin only).
   */
  async getSummaryStats() {
    return await this.rsvpRepository.getStats();
  }
}

module.exports = RsvpService;
