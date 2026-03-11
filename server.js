const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const MY_CITY = "בת ים";

// נתיב ראשי - מציג את הלוח
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// נתיב שבודק אם יש אזעקה כרגע
app.get('/check-alert', async (req, res) => {
    try {
        const response = await axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json', {
            headers: { 'Referer': 'https://www.oref.org.il/' }
        });
        const data = response.data;
        const isAlert = data && data.length > 0 && data[0].data.includes(MY_CITY);
        
        res.json({ 
            alert: isAlert, 
            location: MY_CITY,
            info: isAlert ? data[0].title : "" 
        });
    } catch (error) {
        res.json({ alert: false });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));            if (latest.id !== lastAlertId && latest.data.includes(MY_CITY)) {
                lastAlertId = latest.id;
                await sendWhatsappAlert(latest.title, MY_CITY);
            }
        }
    } catch (error) {}
}

setInterval(backgroundScanner, 3000);

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

app.get('/cities', async (req, res) => {
    try {
        const response = await axios.get('https://www.oref.org.il/Shared/Ajax/GetCities.aspx', { headers: { 'Referer': 'https://www.oref.org.il/' } });
        res.json(response.data);
    } catch (error) { res.status(500).send(error); }
});

app.get('/alerts', async (req, res) => {
    try {
        const response = await axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json', { headers: { 'Referer': 'https://www.oref.org.il/' } });
        res.json(response.data);
    } catch (error) { res.status(500).send(error); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
