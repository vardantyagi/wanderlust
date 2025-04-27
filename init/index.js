const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

console.log(initData);


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(res=>console.log('database connected successfully')).catch(err=>console.log('some error occurred in database'))

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initialiseDatabase = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "680b0bb89418147a465cf5a1"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized.");
}

initialiseDatabase();