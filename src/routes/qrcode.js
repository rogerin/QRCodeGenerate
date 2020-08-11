var express = require('express');
var router = express.Router();

var QRCode = require('qrcode-svg');


/* GET users listing. */
router.get('/helper', function(req, res, next) {
    res.json({
        params: {
            ecl: {
                defaultValue: "L",
                options: ['L', 'M', 'H', 'Q']
            },
            background: {
                defaultValue: "white",
                options: { message: 'ALL HEXA exemple #FF0000 '}
            },
            color: {
                defaultValue: "#000000",
                options: { message: 'ALL HEXA exemple #FF0000 '}
            },
            width: {
                defaultValue: "200",
                options: { message: 'Numbem in pixel '}
            },
            height: {
                defaultValue: "200",
                options: { message: 'Numbem in pixel '}
            }
        }
    })
})
/* GET users listing. */
router.get('/', function(req, res, next) {
    const { url, ecl, background, color, width,height } = req.query
    if(!url) {
        res.json({error: 'URL faltando...'} )
    } 

    const svg = new QRCode(
        {
            content: url,
            ecl: ecl || "L",
            background: '#'+background || 'white',
            color: '#'+color ||  '#000000',
            width: width ||  '200',
            height: height ||  '200',
            
            
        } 
    );
    res.statusCode = 200;
    res.setHeader('Content-type', 'image/svg+xml')
    
    res.send(svg.svg())
});

module.exports = router;
