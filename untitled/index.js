const TelegramBot = require('node-telegram-bot-api');
const token = '6237898215:AAHY96l4qREb75l3MqUf2jjDXcxvIY6xxDY';
const bot = new TelegramBot(token, {polling: true});
const {gameOptions, againOptions} = require('./options')
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Список моих возможностей'},
        {command: '/game', description: 'Это игра'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatID);
        }
        return bot.sendMessage(chatID, 'я тебя не понимаю')
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatID = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatID);}
        if (data === chats[chatID]) {
            return await bot.sendMessage(chatID, `Поздравляю ты отгадал цифру ${chats[chatID]}`, againOptions)
        } else {
            return await bot.sendMessage(chatID, `К сожалению ты не угадал цифру, бот загадал цифру ${chats[chatID]}`, againOptions)
        }
    })
}
start()