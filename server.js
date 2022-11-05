const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const process = require('process')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const OTP = require('./models/OTP');
const url = 'mongodb://username:pass@IP:Port/dbname'
// const url = 'mongodb://mcareappadmingueirfgubv:jJFEWnf65nG0IlUeb3S5ndLF8@75.119.139.19:27913/mcareapp'
const port = process.env.PORT || 5400
const handleErr = require('./HandleFunction/HandleErr');
const handleSuccess = require('./HandleFunction/handleSuccess');
const rateLimit = require("express-rate-limit");
const server = require('http').createServer(app);

const nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hello@example.com',
          pass: 'generated password'
        }
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    Promise = require('bluebird');

function sendEmail(obj) {
    return transporter.sendMail(obj);
}

//OTP Middleware
function sendOtp(req, res, next) {
    const randomNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    let request = req.body
    let message = 'Your verification code is: ' + randomNumber
    let users = [
        {
            email: request.email,
            name: request.name,
            message: message
        }
    ]
    loadTemplate('otp', users).then((results) => {
        return Promise.all(results.map((result) => {
            console.log(result.email.html)
            sendEmail({
                to: result.context.email,
                from: 'Test Email <mail@gmail.com>',
                subject: result.email.subject,
                html: result.email.html,
                text: result.email.text

            });
        }));
    }).then(() => {
        console.log('Done=>', message)
        bcrypt.hash(randomNumber.toString(), salt, (err, hashed) => {
            if (err) {
                return res.json(handleErr(err))
            }
            else {
                let date = new Date(Date.now())
                date.setHours(date.getHours() + 6)
                let data = {
                    validTill: date
                }
                data.code = hashed
                OTP.create(data, (error, doc) => {
                    if (error) return res.json(handleErr(error))
                    else {
                        let response = {
                            salt,
                            number: randomNumber,
                            doc
                        }
                        req.result = response
                        next()
                    }
                })
            }
        })
    });
}
function loadTemplate(templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}
mongoose.connect(url, { useNewUrlParser: true }) //MongoDB connection using Mongoose
var db = mongoose.connection //Mongo Connection Instance

db.on('open', () => {
    console.log('database connected')
})
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);
app.use(cors())
// app.use(express.limit('50M'));
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
app.use(express.static('uploads'))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send("<h1>Hello from Email backend</h1>")
})



app.post('/api/sendOtp', sendOtp, (req, res) => {
    return res.json(handleSuccess(req.result))
})

// app.get('/api/deleteActiveOrders',(req,res)=>{
//     Order.deleteMany({status:"travelling"},(err,docs)=>{
//         if(err)return res.json(handleErr(err))
//         else{
//             return res.json(handleSuccess(docs))
//         }
//     })
// })


// app.get('/api/randomMessage',(req,res)=>{
//     Order.find({},'customer',(err,docs)=>{
//         if(err)return res.json(handleErr(err))
//         else{
//             docs.forEach((doc)=>{
//                 let messages = randomArr(allMessages).slice(0,100).map((msg)=>{
//                     return {
//                         ...msg,
//                         customer:doc._doc.customer
//                     }
//                 })
//                 Order.findByIdAndUpdate(doc._id,{$set:{messages:messages}},{new:true},(er,ord)=>{
//                     if(er)return res.json(handleErr(er))
//                 })
//             })
//             setTimeout(()=>{
//                 return res.json(handleSuccess('DONE'))
//             },30000)
//         }
//     })
// })
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});