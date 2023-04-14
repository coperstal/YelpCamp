const mongoose = require('mongoose');
const cities=require('./cities')
const {places, descriptors}=require("./seedHelpers");
const Campground=require("../models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-Camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample= array => array[Math.floor(Math.random()*array.length)]


const seedDB=async()=>{
    await Campground.deleteMany({});
    
    for(let i=0 ;i<300; i++){
        const random1000=Math.floor(Math.random()*100);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:"64248f2043dd0c7087f2b798",
            location:`${cities[random1000].city},${cities[random1000].state}`, 
            title:`${sample(descriptors)} ${sample(places)}`,    
            description: 'Mia perigrafi gia ayto poy blepete, einai mia xara na kserete. OKEY ???' ,
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                    url:"https://res.cloudinary.com/doibcox2n/image/upload/v1681041658/YelpCamp/cmkhzmymdq9yvczgjjnt.jpg",
                    filename:"YelpCamp/fgzskk2fnx6hsvqprgwn"
                },
                {
                    url:"https://res.cloudinary.com/doibcox2n/image/upload/v1680358539/YelpCamp/pyfluuzcgucxajyht6hw.jpg",
                    filename:"YelpCamp/pyfluuzcgucxajyht6hw"
                }
            ]    
        })
        await camp.save();
    }
    
    
}

seedDB().then(()=>{
    mongoose.connection.close();
})