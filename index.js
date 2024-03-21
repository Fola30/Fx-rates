import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const apiKey = 'ca85dd51e3b653cd6b0350af';
const baseUrl = 'https://v6.exchangerate-api.com/v6';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const currencies = ['AED', 'AUD', 'CAD', 'CNY', 'EUR', 'GBP', 'INR', 'JPY', 'ZAR', 'USD', 'NGN', 'GHS'];
var initCurrency = 'NGN';

app.get('/', async (req, res) => {
    try {
        const result = await axios.get(`${baseUrl}/${apiKey}/latest/${initCurrency}`);
        const rates = Object.entries(result.data.conversion_rates).slice(1);
        const date = result.data.time_last_update_utc.slice(0, 16);
        const base = result.data.base_code;
        var rateList = [];

        rates.forEach((item, index) => {
            if (currencies.includes(item[0])) {
                var currency = {
                    code: item[0],
                    rate: (1/item[1]).toFixed(3),
                    img: `https://flagsapi.com/${item[0].slice(0, 2)}/shiny/32.png`,
                };
                rateList.push(currency);
            }
        })
        
        res.render('index.ejs', {
            data: rateList,
            date: date,
            baseCode: base,
            baseImg: `https://flagsapi.com/${base.slice(0, 2)}/shiny/32.png`,
        });
    } catch (error) {
        console.log(error);
    }
});

app.post('/submit', (req, res) => {
    initCurrency = req.body.currency;
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Started listening at ${port}`);
});