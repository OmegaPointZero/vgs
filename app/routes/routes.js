const https = require('https')
const request = require('request')
const unirest = require('unirest')
const tunnel = require('tunnel');
const fs = require('fs')

module.exports = (function(){

    var app = require('express').Router()

    app.get('/', (req,res) => {
        res.render('home.ejs', {message:''})
    })    

    app.post('/encrypt', (req,res) => {
        var body = req.body
        var options = {
            hostname: process.env.FORWARD_HTTPS_PROXY_HOST,
            port: 443,
            path: '/post',
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }
        }
        var sentData = https.request(options, function(resp){
            resp.setEncoding('utf8');
            resp.on('data',function(d){
                d = JSON.parse(d)
                d.alertType = "encrypt"
                res.render('home.ejs', {message:d})
            })
        })

        sentData.write(JSON.stringify(body))
        sentData.end()
    })

    app.post('/decrypt', (req,res) => {
        var reqbody = req.body

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const tunnelingAgent = tunnel.httpsOverHttp({
            ca: [ fs.readFileSync(process.env.FORWARD_HTTPS_PROXY_PEM)],
            proxy: {
                host: process.env.FORWARD_HTTPS_PROXY_HOST,
                port: process.env.FORWARD_HTTPS_PROXY_PORT,
                proxyAuth: process.env.HTTPS_PROXY_USERNAME+':'+process.env.HTTPS_PROXY_PASSWORD
            }
        });

        request({
            url: 'https://echo.apps.verygood.systems/post',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            agent: tunnelingAgent,
            body: JSON.stringify(reqbody)
          }, function(error, response, body){
            if(error) {
              console.log(error);
            } else {
              var retbody = JSON.parse(body);
              var json = retbody.data;
              var data = {}
              data.alertType = "decrypt"
              data.json = JSON.parse(json)
              res.render('home.ejs', {message:data})
            }
        });
          
    })

    return app
})();
