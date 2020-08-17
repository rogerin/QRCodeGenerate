var express = require('express');
var router = express.Router();
var constants = require('../config/constants');
const fs = require('fs');
var path = require("path"); 

var QRCode = require('qrcode-svg');

require('babel-polyfill');
    var brandedQRCode = require('branded-qr-code');



async function logo (res, data) {
    //const file = path.resolve("./") + `/public/images/icons/${data.logo}.png`
    
    // Return a buffer with the PNG of the code
    const qr = await brandedQRCode.generate({ 
        text: data.url, 
        path: data.logo,
        ratio: data.ratio || 2,
        ignoreCache: true,
        opt: {
            width: data.width || 200,
            height: data.height || 200,
            color: {
                dark: data.color ? '#'+data.color : '#000000',
                light: data.background ? '#'+data.background : '#ffffff' // Transparent background
                }
        }
    })
    brandedQRCode.route(res)
    return qr;
}


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


router.get('/down/logo', async (req, res) => {
    const { url_logo, url, ratio, background, color, width,height, download } = req.query;
    const crypto = require("crypto");
    

    const downImg = require('../utils/downloadImage')
    const time = new Date().getTime();
    const file = path.resolve("./") + `/public/images/icons/${time}.png`
    
    downImg(url_logo, file, () => {
        let data = {
            url,
            logo: file,
            ratio, 
            background, 
            color, 
            width,
            height
        }
    
        brandedQRCode.generate({ 
            text: data.url, 
            path: data.logo,
            ratio: data.ratio || 2,
            ignoreCache: true,
            opt: {
                width: data.width || 200,
                height: data.height || 200,
                color: {
                    dark: data.color ? '#'+data.color : '#000000',
                    light: data.background ? '#'+data.background : '#ffffff' // Transparent background
                    }
            }
        }).then( (a) => {
            brandedQRCode.route(res)
        
            if(download) {
                res.attachment("qrcode.png");
                res.setHeader('Content-type', 'image/png')
                res.status(200).send(a);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-type', 'image/png')
                res.send(a);
            }
            fs.unlinkSync(file)
        })

    });


    

})



    

module.exports = router;
