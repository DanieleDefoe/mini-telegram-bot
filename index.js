const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const { commands } = require('./commands')

// const UserModel = require('./models')

const token = '6720032532:AAHA4mRvqFlqzuKP8AAtXqfgPrvVhweQqqI'

const bot = new TelegramApi(token, { polling: true })

/** @returns {string} String(integer) from 0 to 9 */
function createRandomNumber() {
  return String(Math.floor(Math.random() * 10))
}

/** @type {{ [chatId: number]: number }} */
const chats = {}

/** @param {number} chatId */
const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Now I\'m gonna choose a number from 0 to 9 and you will have to guess it!')
  const randomNumber = createRandomNumber()

  chats[chatId] = randomNumber

  await bot.sendMessage(chatId, 'Guess!', gameOptions)
}

const start = async () => {
  bot.setMyCommands(commands)

  bot.on('message', async (msg) => {
    const { text, chat: { id: chatId }, from: { first_name, username } } = msg;

    try {
      if (text === '/start') {
        await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/v/ViktKobST/ViktKobST_012.webp')
        return bot.sendMessage(chatId, 'Welcome to Abuzar\'s telegram bot')
      }

      if (text === '/info') {
        return bot.sendMessage(chatId, `Your name is ${first_name} (@${username})`)
      }

      if (text === '/game') {
        return startGame(chatId)
      }

      return bot.sendMessage(chatId, 'I don\'t quite understand you. Could you please try again?')
    } catch (e) {
      return bot.sendMessage(chatId, 'Something went wrong')
    }
  })

  bot.on('callback_query', async (msg) => {
    const { data, message: { chat: { id: chatId } } } = msg;

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data === chats[chatId]) {
      await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/v/ViktKobST/ViktKobST_020.webp')
      await bot.sendMessage(chatId, `Congratulations! You guessed the number ${data}`, againOptions)
    } else {
      await bot.sendMessage(chatId, `That's unfortunate! The actual number was ${chats[chatId]}`, againOptions)
    }
  })
}

start()
