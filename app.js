const express = require('express')
const app = express();
const port = 3000;

const client = require('twilio')('ACSK604a7074dc320976da141c2d0ed9804f', '9860ae5d46c0a68c8f0f2a682019ae98');




// /login
//     - phone number
//     - channel (sms/call)

// /verify
//     - phone number
//     - code

app.get('/', (req, res)=>{
    res.status(200).send({
        message: "You are on Homepage",
        info: {
            login: "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
            verify: "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code"
        }
    })
});

// Login Endpoint
app.get('/login', (req,res) => {
     if (req.query.phonenumber) {
        client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+${req.query.phonenumber}`,
            channel: req.query.channel==='call' ? 'call' : 'sms' 
        })
        .then(data => {
            res.status(200).send({
                message: "Verification is sent!!",
                phonenumber: req.query.phonenumber,
                data
            })
        }) 
     } else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.query.phonenumber,
            data
        })
     }
});

// Verify Endpoint
app.get('/verify', (req, res) => {
    if (req.query.phonenumber && (req.query.code).length === 4) {
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phonenumber: req.query.phonenumber,
            data
        })
    }
});

// listen to the server at 3000 port
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
});





// const express = require('express');
// const app = express();
// const debug = require('debug')('app');
// const morgan = require('morgan');
// const path = require('path');

// const twilio = require('twilio');

// const sessionsRoute = express.Router();

// // app.use(morgan('combined'));
// app.use(morgan('tiny'));
// app.use(express.static(path.join(__dirname, 'public')));

// sessionsRoute.route('/').get((req, res) => res.render('index'));
// sessionsRoute.route('/:id').get((req, res) => {const id = req.params.id; res.send(`hello single sessions ${id}`)});

// app.use('/sessions', sessionsRoute);

// app.get('/', (req, res) => {
//   // res.send('Hello from express');
//   res.render('index');
// });

// app.get('/login', (req, res) => {
//   // req.setTimeout(10000); //set a 10s timeout for this request

//   const client = new twilio(accountSid, authToken);

//   console.log(client);

//   client.verify.services('')
//                 .verifications
//                 .create({to: '+34666239622', channel: 'sms'})
//                 .then(verification => console.log(verification.status));

//                 console.log('despues de la verificacion');

//   // client.messages
//   // .create({
//   //     body: 'Hello from Node',
//   //     to: '+34666239622', // Text this number
//   //     from: '+15005550006', // From a valid Twilio number
//   // })
//   // .then((message) => res.send(message));
// });

// app.listen(3000, () => debug('listening on port 3000'));