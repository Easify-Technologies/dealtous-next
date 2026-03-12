const transitions = {
  PENDING: ["PAYMENT_AUTHORIZED", "CANCELLED"],

  PAYMENT_AUTHORIZED: ["SELLER_TRANSFER_PENDING", "CANCELLED"],

  SELLER_TRANSFER_PENDING: ["BUYER_CONFIRMED", "DISPUTE"],

  BUYER_CONFIRMED: ["RELEASE_READY"],

  RELEASE_READY: ["RELEASED"],

  RELEASED: [],

  DISPUTE: [],

  REFUNDED: [],

  CANCELLED: []
};

function canTransition(current, next) {
  if (!transitions[current]) return false;
  return transitions[current].includes(next);
}

module.exports = { canTransition };