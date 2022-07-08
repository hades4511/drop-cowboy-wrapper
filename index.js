require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const formatData = data => {
    data.team_id = process.env.team_id;
    data.foreign_id = process.env.foreign_id;
    data.secret = process.env.secret;
    data.audio_type = 'mp3';
    data.phone_number = `+${data.phone_number.trim()}`;
    data.caller_id = `+${data.caller_id.trim()}`;
    data.callback_url = 'https://dropcowboy.herokuapp.com/status';
}

const sendRequest = (res, data) => {
    formatData(data);
    console.log(data);
    axios({
        method: 'post',
        url: process.env.url,
        data: data,
    })
    .then(response => {
        console.log(response.headers['content-type']);
        const apiResponse = response.data ? response.data : {success: true};
        if(response.headers['content-type'] !== 'application/json') {
            return res.send(apiResponse);
        }
        else {
            console.log(apiResponse);
            return res.json(apiResponse);
        }
    })
    .catch(error => {
        console.log(error);
        res.json(error);
    });
};

app.post('/post', (req, res, next) => {
    console.log('POST URL');
    return sendRequest(res, req.query);
});

app.get('/get', (req, res, next) => {
    console.log('GET URL');
    return sendRequest(res, req.query);
});

app.use('/status', (req, res, next) => {
    console.log('status');
    console.log(req.body);
    return res.json({success: true});
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
