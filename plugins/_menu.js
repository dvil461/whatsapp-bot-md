const bot = require('../lib/events')
const {
	ctt,
	addSpace,
	textToStylist,
	PREFIX,
	getUptime,
	PLUGINS,
	getRam,
} = require('../lib/')
const { VERSION, FOOTERMARK, BOT_INFO, } = require('../config')
bot.addCommand(
	{
		pattern: 'help ?(.*)',
		fromMe: true,
		dontAddCommandList: true,
	},
	async (message, match) => {
		const date = new Date()
		let CMD_HELP = `╭────────────────╮
						ʟᴇᴠᴀɴᴛᴇʀ
╰────────────────╯

╭────────────────
│ Prefix : ${PREFIX}
│ User : ${message.pushName}
│ Time : ${date.toLocaleTimeString()}
│ Day : ${date.toLocaleString('en', { weekday: 'long' })}
│ Date : ${date.toLocaleDateString('hi')}
│ Version : ${VERSION}
│ Plugins : ${PLUGINS.count}
│ Ram : ${getRam()}
│ Uptime : ${getUptime('t')}
╰────────────────
╭────────────────
`
		const commands = []
		bot.commands.map(async (command, index) => {
			if (
				command.dontAddCommandList === false &&
				command.pattern !== undefined
			) {
				commands.push(ctt(command.pattern))
			}
		})
		commands.forEach((command, i) => {
			CMD_HELP += `│ ${i + 1} ${addSpace(
				i + 1,
				commands.length
			)}${textToStylist(command.toUpperCase(), 'mono')}\n`
		})
		CMD_HELP += `╰────────────────`
		return await message.sendMessage('' + CMD_HELP + '')
	}
)


bot.addCommand(
	{
		pattern: 'menu ?(.*)',
		fromMe: true,
		dontAddCommandList: true,
	},
	async (message, match) => {
		const commands = {}
		bot.commands.map(async (command, index) => {
			if (
				command.dontAddCommandList === false &&
				command.pattern !== undefined
			) {
				if (!commands[command.type]) commands[command.type] = []
				commands[command.type].push(ctt(command.pattern).trim())
			}
		})
		const date = new Date()

		let msg =
			'' +
			`╔════⟬  ${BOT_INFO.split(",")[1]}  ⟭════❃
║
╠❐  𝐎𝐖𝐍𝐄𝐑 : ${BOT_INFO.split(",")[0]}
║ 
╠❐  𝐏𝐑𝐄𝐅𝐈𝐗 : ${PREFIX}
║
╠❐  𝐔𝐒𝐄𝐑: ${message.pushName}
║
╠❐  𝐓𝐈𝐌𝐄 : ${date.toLocaleTimeString()}
║
╠❐  𝐃𝐀𝐘 : ${date.toLocaleString('en', { weekday: 'long' })}
║
╠❐  𝐃𝐀𝐓𝐄 : ${date.toLocaleDateString('hi')}
║
╠❐  𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : ${VERSION}
║
╠❐  𝐓𝐎𝐓𝐀𝐋 𝐏𝐋𝐔𝐆𝐈𝐍𝐒 : ${PLUGINS.count}
║
╠❐  𝐔𝐏𝐓𝐈𝐌𝐄 : ${getUptime('t')}
║ 
║
║       
║   ▎▍▌▌▎▌▉▐▏▌
║   ▎▍▌▌▎▌▉▐▏▌
║   
║     ${FOOTERMARK}
╚═══════════════════❃
` +
			''
		for (const command in commands) {
			msg += `╔═❃ ${textToStylist(
				command.toLowerCase(),
				'smallcaps'
			)} ❃
`
			for (const plugin of commands[command])
				msg += `╠❐ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
			msg += `╚════════════════❃
`
		}
		await message.sendMessage(msg.trim())
	}
)
