// In-memory token blocklist for invalidating JWTs on logout.
// Note: this is reset on server restart; use a persistent store (e.g. Redis)
// for production use.
const blocklist = new Set();

module.exports = {
  add: (token) => blocklist.add(token),
  has: (token) => blocklist.has(token),
};
