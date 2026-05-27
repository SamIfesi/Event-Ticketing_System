import api from './api';

const OrganizerPaymentService = {
  // GET /api/organizer/banks
  // Returns Paystack's list of supported banks for the dropdown
  async getBanks() {
    const response = await api.get('/organizer/banks', { skipLoader: true });
    return response.data.data; // { banks: [{ name, code }] }
  },

  // POST /api/organizer/resolve-account
  // Verify a bank account and return the account holder name
  // Call this before saving so the user can confirm their name
  // Body: { account_number, bank_code }
  async resolveAccount({ accountNumber, bankCode }) {
    const response = await api.post('/organizer/resolve-account', {
      account_number: accountNumber,
      bank_code: bankCode,
    });
    return response.data.data; // { account_name, account_number }
  },

  // GET /api/organizer/payment-details
  // Returns saved bank details (account number is masked)
  async getPaymentDetails() {
    const response = await api.get('/organizer/payment-details', {
      skipLoader: true,
    });
    return response.data.data; // { payment_details } or { payment_details: null }
  },

  // POST /api/organizer/payment-details
  // Save bank details for the first time
  // Automatically: resolves account, creates Paystack subaccount + recipient
  // Body: { bank_name, bank_code, account_number, platform_fee_percentage }
  async savePaymentDetails({
    bankName,
    bankCode,
    accountNumber,
    platformFeePercentage,
  }) {
    const response = await api.post('/organizer/payment-details', {
      bank_name: bankName,
      bank_code: bankCode,
      account_number: accountNumber,
      platform_fee_percentage: platformFeePercentage,
    });
    return response.data.data; // { account_name, subaccount_code, platform_fee_percentage }
  },

  // PUT /api/organizer/payment-details
  // Update existing bank details
  // Re-verifies account and updates the Paystack subaccount automatically
  // Body: { bank_name, bank_code, account_number, platform_fee_percentage }
  async updatePaymentDetails({
    bankName,
    bankCode,
    accountNumber,
    platformFeePercentage,
  }) {
    const response = await api.put('/organizer/payment-details', {
      bank_name: bankName,
      bank_code: bankCode,
      account_number: accountNumber,
      platform_fee_percentage: platformFeePercentage,
    });
    return response.data.data; // { account_name, platform_fee_percentage }
  },

  // GET /api/organizer/payouts
  // Organizer's own payout history
  // ?page=&limit=
  async getMyPayouts(params = {}) {
    const response = await api.get('/organizer/payouts', { params });
    return response.data.data; // { payouts[], pagination }
  },
};

export default OrganizerPaymentService;
