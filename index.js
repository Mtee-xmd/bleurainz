const {
  default: makeWASocket,
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const { Boom } = require('@hapi/boom');
const fs = require('fs');

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using WA version: ${version}, latest: ${isLatest}`);

  const { state, saveState } = useSingleFileAuthState('./creds.json');

  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: state,
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);

      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Bot connected successfully');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    console.log(`📩 Message from ${sender}: ${messageText}`);

    if (messageText.toLowerCase() === 'hi' || messageText.toLowerCase() === 'hello') {
      await sock.sendMessage(sender, { text: '👋 Hello! I am your bot. How can I help you?' });
    }
  });
}

startBot();