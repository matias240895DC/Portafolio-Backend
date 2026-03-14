const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://matiasdeicastelli83_db_user:WPDrXCWQ6KllSyMk@cluster0.gbkazd6.mongodb.net/portfolio';

async function checkDB() {
    await mongoose.connect(MONGO_URI);
    
    const ProfileSchema = new mongoose.Schema({
        about: String,
        socialLinks: Object
    }, { strict: false });
    
    const Profile = mongoose.model('Profile', ProfileSchema);
    
    const profiles = await Profile.find();

    
    await mongoose.disconnect();
}

checkDB().catch(console.error);
