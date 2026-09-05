const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DNS_FALLBACK_SERVERS = (process.env.MONGODB_DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

const isSrvDnsRefusal = (error) =>
  MONGODB_URI?.startsWith('mongodb+srv://') &&
  error?.code === 'ECONNREFUSED' &&
  error?.syscall === 'querySrv';

const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error('MongoDB connection error: MONGODB_URI is not set in api/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    if (isSrvDnsRefusal(error) && DNS_FALLBACK_SERVERS.length > 0) {
      try {
        console.warn(
          `MongoDB SRV lookup was refused by ${dns.getServers().join(', ') || 'the system DNS resolver'}; ` +
          `retrying with ${DNS_FALLBACK_SERVERS.join(', ')}`
        );
        dns.setServers(DNS_FALLBACK_SERVERS);
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
        return;
      } catch (retryError) {
        console.error('MongoDB connection error after DNS fallback:', retryError);
        process.exit(1);
      }
    }

    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
