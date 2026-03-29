const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const Profile = mongoose.model('Profile', new mongoose.Schema({ socialLinks: Object }, { strict: false }));
  const profile = await Profile.findOne({});
  const cvUrl = profile?.socialLinks?.cvUrl;
  console.log('--- PROFILE CV URL ---');
  console.log(cvUrl);
  console.log('----------------------');

  if (cvUrl && cvUrl.includes('localhost')) {
    const url = new URL(cvUrl);
    // Force port 10000 for local nestjs test
    const testUrl = `http://127.0.0.1:10000${url.pathname}`;
    console.log(`Testing backend static serve at: ${testUrl}`);
    
    http.get(testUrl, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log('HEADERS: ', JSON.stringify(res.headers));
      process.exit(0);
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      process.exit(1);
    });
  } else {
    process.exit(0);
  }
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
