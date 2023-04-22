const axios=require("axios");

const routeeToken=process.env.ROUTEE_TOKEN;


 
module.exports.getSms=(title)=> axios({
        method:"post",
        url:"https://connect.routee.net/sms",
        headers:{
            authorization: "Bearer "+routeeToken,
            contentype:" application/json"
        },
        data:{
            from:"YelpCamp",
            body:`new ${title}`,
            to:""
        }
    })
    