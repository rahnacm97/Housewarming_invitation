/**
 * House Warming Invitation Configuration File
 * Update this file to customize the invitation details.
 */
export const CONFIG = {
  hosts: "The Malhotra Family",
  eventTitle: "Griha Pravesh & House Warming",
  houseName: "Siddharth Villa",
  date: "Sunday, August 16, 2026",
  countdownDate: "2026-08-16T09:00:00", // ISO-8601 string for countdown target
  venueName: "Siddharth Villa, Plot No. 42, Green Meadows Enclave, Sector 62",
  venueCity: "Noida, Uttar Pradesh, India",
  googleMapsLink: "https://maps.app.goo.gl/yYvSg7yPXZRnmVvS8", // Update with your actual directions URL
  apiBaseUrl: "https://housewarming-invitation-api.onrender.com/api", // Base URL of Express backend
  timeline: [
    {
      time: "09:00 AM",
      title: "Griha Pravesh Pooja",
      description: "Traditional auspicious entry rituals and Kalash Sthapana to bless our new home."
    },
    {
      time: "10:30 AM",
      title: "Havan & Vastu Shanti",
      description: "Fire prayers and sacred chanting for clearing energies and bringing prosperity."
    },
    {
      time: "12:30 PM",
      title: "Festive Lunch",
      description: "Join us for a grand traditional buffet lunch to celebrate this milestone together."
    },
    {
      time: "03:30 PM",
      title: "High Tea & House Tour",
      description: "Explore our new home, check out the backyard, and join us for tea and coffee."
    }
  ],
  musicUrl: "/audio/bg-music.mp3", // Background music path (in public folder)
  contactDetails: {
    phone1: "+91 98765 43210",
    phone2: "+91 87654 32109"
  }
};
