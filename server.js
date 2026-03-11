const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(cors());

// --- הגדרות וואטסאפ ---
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // הגדרות חובה להרצה בענן
    }
});

client.on('qr', (qr) => {
    // את ה-QR הזה תראה ב-Logs של Render/המחשב
    qrcode.generate(qr, { small: true });
    console.log('סרוק את הקוד כדי לחבר את הוואטסאפ!');
});

client.on('ready', () => {
    console.log('הוואטסאפ מחובר ומוכן לשלוח הודעות!');
});

client.initialize();

// פונקציית עזר לשליחת הודעה
async function sendWhatsappAlert(title, cities) {
    const myNumber = "972501234567@c.us"; // <<< שנה למספר שלך (פורמט: מדינה ללא 0 בהתחלה)
    let message = "";

    if (title.includes("טילים") || title.includes("רקטות")) {
        message = `🚨 *אזעקת טילים!* \nערים: ${cities}\nחובה להיכנס למקלט מיד. 🏃💨`;
    } else {
        message = `⚠️ *התרעת שברי טילים/כטב"ם* \nערים: ${cities}\nניתן להישאר בבית, להתרחק מחלונות. 🏠🛡️`;
    }

    try {
        await client.sendMessage(myNumber, message);
        console.log("הודעת וואטסאפ נשלחה!");
    } catch (err) {
        console.error("שגיאה בשליחת וואטסאפ:", err);
    }
}

// --- נתיבי API ---

app.get('/alerts', async (req, res) => {
    try {
        const response = await axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json', {
            headers: {
                'Referer': 'https://www.oref.org.il/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const data = response.data;

        // בדיקה אוטומטית בשרת: אם יש התרעה בבת ים, שלח וואטסאפ מיד
        if (data && data.length > 0) {
            const latest = data[0];
            const myCity = "בת ים"; // העיר שאתה רוצה לקבל עליה הודעה
            
            if (latest.data.includes(myCity)) {
                sendWhatsappAlert(latest.title, myCity);
            }
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "שגיאה במשיכת התרעות" });
    }
});

app.get('/cities', async (req, res) => {
    try {
        const response = await axios.get('https://www.oref.org.il/Shared/Ajax/GetCities.aspx', {
            headers: { 'Referer': 'https://www.oref.org.il/' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "שגיאה בטעינת ערים" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
