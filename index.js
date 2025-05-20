const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require('@whiskeysockets/baileys');
const P = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const mega = require('megajs');
const fs = require('fs');
require('dotenv').config(); // Load environment variables
const { default: makeWASocket } = require('@whiskeysockets/baileys');
const COMMAND_PREFIX = '.'; // Command prefix
const MEGA_SESSION_ID = process.env.MEGA_SESSION_ID; // Mega session ID from environment variable
const PHONE_NUMBER = process.env.PHONE_NUMBER; // Your WhatsApp phone number in E.164 format without '+'
const apiKey = process.env.YOUTUBE_API_KEY;
let isBotConnected = false;
let lastActivityTime = null;
let botUptime = null;

async function downloadSessionFromMega() {
  if (!MEGA_SESSION_ID) {
    console.error('No Mega session ID provided in .env file.');
    return;
  }

  const megaSessionId = MEGA_SESSION_ID.replace('humbah~', ''); // Replace if the ID is prefixed
  const filer = mega.File.fromURL(`https://mega.nz/file/${megaSessionId}`);

  console.log('[ 📥 ] Downloading session from Mega.nz...');

  try {
    const data = await new Promise((resolve, reject) => {
      filer.download((err, fileData) => {
        if (err) return reject(err);
        resolve(fileData);
      });
    });

    // Save the session data to a file
    const sessionFilePath = './auth_info/creds.json';
    fs.mkdirSync('./auth_info', { recursive: true });
    fs.writeFileSync(sessionFilePath, data);
    console.log('[ ✅ ] Session downloaded successfully.');
  } catch (error) {
    console.error('[ ❌ ] Failed to download session from Mega.nz:', error);
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using Baileys version:{version.join('.')}, isLatest: isLatest`);

  // Create WhatsApp socket connection
  const sock = makeWASocket(
    version,
    logger: P( level: 'silent' ),
    printQRInTerminal: false, // Set to false to use pairing code
    auth: state,
    browser: ['HumbaBot', 'Chrome', '1.0.0'],
  );

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => 
    const  connection, lastDisconnect, isNewLogin  = update;

    if (connection === 'connecting'        isNewLogin        !sock.authState.creds.registered) 
      try 
        const code = await sock.requestPairingCode(PHONE_NUMBER);
        console.log(`🔗 Pairing code:{code}`);
      } catch (err) {
        console.error('Error generating pairing code:', err);
      }
    }

    if (connection === 'open') {
      isBotConnected = true;
      botUptime = new Date(); // Record bot's uptime
      console.log('✅ Connected to WhatsApp');
    } else if (connection === 'close') {
      isBotConnected = false;
      lastActivityTime = new Date(); // Record last activity
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
        console.log('❌ Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) {
        startBot(); // Restart the bot if disconnected
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return; // Ignore self-sent messages

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    // Command handling (checking for prefix)
    if (text && text.startsWith(COMMAND_PREFIX)) {
      const command = text.slice(COMMAND_PREFIX.length).trim().toLowerCase(); // Extract the command

      // Command handling
      if (command === 'help') {
        await sock.sendMessage(sender, {
          text: 'How can I assist you? Type .media to send media, or .info for more info.',
        });
      } else if (command === 'info') {
        await sock.sendMessage(sender, { text: 'I am a WhatsApp bot built using Baileys.' });
      } else if (command === 'media') {
        await sock.sendMessage(sender, {
          text: 'You can send me images, videos, or audio!',
        });
      } else if (command === 'status') {
        // Handle .status command
        const currentTime = new Date();
        const timeSinceLastActivity = lastActivityTime
          ? (currentTime - lastActivityTime) / 1000
          : 0;
        const timeSinceLastActivityStr =
          timeSinceLastActivity > 0
            ? `Math.floor(timeSinceLastActivity) seconds ago`
            : 'No activity yet';

        const uptimeStr = botUptime
          ? `Uptime:{Math.floor((currentTime - botUptime) / 1000)} seconds`
          : 'Bot is not yet connected';

        const statusMessage = `Bot Status:
- Connected: isBotConnected ? 'Yes' : 'No'
- Last Activity:{timeSinceLastActivityStr}
- ${uptimeStr}`;

        await sock.sendMessage(sender, { text: statusMessage });
      } else if (command === 'statusreact') {
        // Handle .statusreact command
        await sock.sendMessage(sender, {
          text: 'status reacted by humba!',
        });
        // Send a reaction to the user's status message (you can adjust the emoji or message)
        await sock.sendMessage(sender, {
          react: { text: '♥️,✌️,💗,💓,💞', key: msg.key },
        });
      } else {
        await sock.sendMessage(sender, {
          text: 'Unknown command! Type .help for a list of available commands.',
        });
      }
    }

    // Media Handling: Checking if a message contains media
    if (msg.message?.imageMessage ||
      msg.message?.videoMessage ||
      msg.message?.audioMessage ) {
       let mediaType =
      const path = require('path');

if (process.env.UPTIME_LOG === 'true') {
  const logPath = path.resolve(process.env.UPTIME_LOG_FILE || 'logs/uptime.log');

  setInterval(() => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const logMessage = `[⏱️] process.env.BOT_NAME uptime:{hours}h minutesm{seconds}s\n`;

    fs.appendFile(logPath, logMessage, (err) => {
      if (err) console.error('[❌] Failed to write uptime log:', err);
    });
  }, 60000); // Every 60 seconds
}
```

// Set default presence status
if (process.env.PRESENCE_ENABLED === 'true') {
  const defaultPresence = process.env.DEFAULT_PRESENCE || 'available';
  await sock.sendPresenceUpdate(defaultPresence);
  console.log(`[✅] Presence status set to ${defaultPresence}`);
}
sock.ev.on('messages.upsert', async ({ messages }) => {const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const sender = msg.key.remoteJid;

  if (process.env.PRESENCE_ENABLED === 'true') {
    // Simulate typing indicator
    await sock.sendPresenceUpdate('composing', sender);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate typing delay
    await sock.sendPresenceUpdate('paused', sender);
  }

  // Proceed with your message handling logic
  // ...
});
// Access the menu picture from the .env file
const menuPicture = process.env.MENU_PICTURE_URL || process.env.MENU_PICTURE_PATH;

async function startBot() {
  const sock = makeWASocket({
    // Bot configuration here
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (text?.toLowerCase() === '.menu') {
      // Send the menu picture (either URL or local image)
      const image = menuPicture ? menuPicture : 'default-image-url';
      await sock.sendMessage(sender, {
        image: { url: image },  // If it's a URL
        caption: 'Here is the menu!' // You can also change this caption
      });
    }
  });
}

startBot();
```
