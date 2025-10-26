// utils/dateUtils.js
function toIST(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d)) return null;
  
    // Convert UTC → IST (subtract 5h30m offset so Mongo saves correct UTC)
    return new Date(d.getTime() - (330 * 60 * 1000));
  }
  
  module.exports = { toIST };
  