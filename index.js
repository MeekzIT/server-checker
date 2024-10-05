const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
var cron = require("node-cron")

const token = '8061745686:AAFboXuCtQSJyJbM1BBW-qStxMzvb3IDQ94';
const chatId = '1338222648';

const bot = new TelegramBot(token, { polling: true });

async function checkAPIs() {
    try {
        const response1 = await axios.get('https://back.jsxmachines.com/');
        console.log('Response from https://back.jsxmachines.com/:', response1.status);

        const response2 = await axios.get('https://hard.jsxmachines.com/api/v1/devices');
        console.log('Response from https://hard.jsxmachines.com/api/v1/devices:', response2.status);

        if (response1.status === 200 && response2.status === 200) {
            bot.sendMessage(chatId, 'Both API calls were successful.');
        } else {
            throw new Error('One or both API calls failed.');
        }

    } catch (error) {
        console.error('API call failed:', error.message);
        bot.sendMessage(chatId, `API call failed: ${error.message}`);
    }
}
async function getAll() {
    try {
        const response1 = await axios.get('http://154.49.137.44:2000/api/v1/devices');
        if (response1.status === 200) {
            console.log(JSON.stringify(response1.data, null, 2), "response1");

            for (const device of response1.data) {
                const message = `Device ID: ${device.p2}, Info: ${JSON.stringify(device, null, 2)}`;
                await bot.sendMessage(chatId, message + ' history');
            }
        }
    } catch (error) {
        console.error('HISTORY API call failed:', error.message);
    }
}

cron.schedule("0 23 * * *", () => {
    getAll()
})

setInterval(checkAPIs, 1200000);

bot.on('message', (msg) => {
    const receivedChatId = msg.chat.id;
    console.log(`Received message from chat ${receivedChatId}:`, msg.text);
});
