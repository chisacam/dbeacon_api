const express = require('express');
const router = express.Router();
const Depart = require('../models/depart');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const result = await Depart.getDepartList();
    const departList = new Array();
    const resultlength = result.length;
    for(let i = 0; i < resultlength; i++) {
        departList.push(result[i]['name']);
    }
    res.json(departList);
});

router.post('/add', async function(req, res, next) {
    const name = req.body['name'];
    await Depart.addDepart({name:name});
    res.json({
        "code":"success"
    });
})

module.exports = router;
