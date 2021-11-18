
import * as express from 'express';
export const app = express();
// import * as admin from "firebase-admin";
const cors = require('cors')({origin: true});
import * as functions from 'firebase-functions';

// import * as CORS from 'cors';
// export const cors = CORS({ origin: true });

function corsMiddleware(req:any, res:any, next:any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
}



app.use(cors);
app.use(corsMiddleware);

// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: 'https://m2bwholesale-219d4.firebaseio.com'
//   });



const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
 service: "gmail",
 host:"stmp.gmail.com",
 port:587,
 secure:false,
 auth: {
user: "orders@m2bwholesale.com",
pass: "Chicha19@@"
 },
 authMethod: 'NTLM',
 tls: {
     rejectUnauthorized: false
 },
 debug: true
});


exports.mailService = functions.https.onRequest((request, response) =>  {
  
  
  cors(request, response, () => {
    return Promise.resolve()
       .then(() => {
         if (request.method !== 'POST') {
          response.send("request.body");
           const error = new Error('Only POST requests are accepted! Code: 401');
           
           throw error;
         }else{
            sendGreetingMail(request.body);
         }
    
   }).catch((err) => {
    console.error(err);
    return Promise.reject(err);
  });
});
   
    
   
   function sendGreetingMail( data: any) {
    const mailOptions = data;

    return mailTransport.sendMail(mailOptions).then(() => {

    console.log("Email sent successfully!")
    }).catch((err: { message: any; }) => {
        console.error(err.message);
    });
   }

})




