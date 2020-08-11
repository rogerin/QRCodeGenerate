var express = require('express');
var router = express.Router();
var constants = require('../config/constants');

var QRCode = require('qrcode-svg');


/* GET users listing. */
router.get('/helper', function(req, res, next) {
    res.json(constants.params)
})
/* GET users listing. */
router.get('/', function(req, res, next) {
    const { url, ecl, background, color, width,height } = req.query
    if(!url) {
        res.json({error: 'URL faltando...'} )
    } 

    const svg = new QRCode(
        {
            content: url, ecl: ecl || "L", background: '#'+background || 'white', 
            color: '#'+color ||  '#000000', width: width ||  '200', height: height ||  '200'
        });
    res.statusCode = 200;
    res.setHeader('Content-type', 'image/svg+xml')
    
    res.send(svg.svg())
});

router.get('/logo/:logo', async function(req, res) {
    require('babel-polyfill');
    var brandedQRCode = require('branded-qr-code');
    var path = require("path"); 

    const { url, ratio, background, color, width,height } = req.query
    const { logo } = req.params
    if(!url) {
        res.json({error: 'URL faltando...'} )
    }
    if(!logo) {
        res.json({error: 'Você deve escolher uma logo. [logo1, logo2, logoverde]'} )        
    }

    var file = path.resolve("./") + `/public/images/icons/${logo}.png`;
    
    // Return a buffer with the PNG of the code
    const qr = await brandedQRCode.generate({ 
        text: url, 
        path: file,
        ratio: ratio || 2,
        ignoreCache: true,
        opt: {
            width: width || 200,
            height: height || 200,
            color: {
                dark: color ? '#'+color : '#000000',
                light: background ? '#'+background : '#ffffff' // Transparent background
              }
        }
    });
    
    
    brandedQRCode.route(res)
    res.statusCode = 200;
    res.setHeader('Content-type', 'image/png')
    res.send(qr);

})



    

module.exports = router;
