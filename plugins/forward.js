const { forwardOrBroadCast, bot, parsedJid } = require('../lib/')

bot(
	{
		pattern: 'forward ?(.*)',
		fromMe: true,
		desc: 'forward replied msg',
		type: 'misc',
	},
	async (message, match) => {
        if (!message.reply_message)
            return await message.sendMessage("*Reply to a Message*");
        let hehe = {}
        hehe.contextInfo = {
                 forwardingScore: 999, // change it to 5 for normal forwarded
                 isForwarded: true 
              } 
        if(message.reply_message){ 
         }
        for (let jid of parsedJid(match)) {
      await forwardOrBroadCast(jid, message, hehe);
    }
    }
)

bot(
	{
		pattern: 'save ?(.*)',
		fromMe: true,
		desc: 'forward replied msg to u',
		type: 'misc',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.sendMessage('*Reply to a message*')
		await forwardOrBroadCast(message.client.user.jid, message)
	}
)
