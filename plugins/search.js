const { bot, audioCut, genHydratedButtons } = require('../lib')
const { y2mate, yts } = require('../lib/')
const FormData = require('form-data')
const fetch = require('node-fetch')
const crypto = require('crypto')

const options = {
	host: 'identify-eu-west-1.acrcloud.com',
	endpoint: '/v1/identify',
	signature_version: '1',
	data_type: 'audio',
	secure: true,
	access_key: 'c816ad50a2bd6282e07b90447d93c38c',
	access_secret: 'ZpYSwmCFpRovcSQBCFCe1KArX7xt8DTkYx2XKiIP',
}

function buildStringToSign(
	method,
	uri,
	accessKey,
	dataType,
	signatureVersion,
	timestamp
) {
	return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
		'\n'
	)
}

function sign(signString, accessSecret) {
	return crypto
		.createHmac('sha1', accessSecret)
		.update(Buffer.from(signString, 'utf-8'))
		.digest()
		.toString('base64')
}

bot(
	{
		pattern: 'find',
		fromMe: true,
		desc: 'Find the Song',
		type: 'misc',
	},
	async (message, match) => {
		if (
			!message.reply_message ||
			(!message.reply_message.audio && !message.reply_message.video)
		)
			return await message.sendMessage('*Reply to audio or video*')
		const p = await message.reply_message.downloadAndSaveMediaMessage('find')
		const data = await audioCut(p, 0, 15)
		const current_data = new Date()
		const timestamp = current_data.getTime() / 1000
		const stringToSign = buildStringToSign(
			'POST',
			options.endpoint,
			options.access_key,
			options.data_type,
			options.signature_version,
			timestamp
		)

		const signature = sign(stringToSign, options.access_secret)

		const form = new FormData()
		form.append('sample', data)
		form.append('sample_bytes', data.length)
		form.append('access_key', options.access_key)
		form.append('data_type', options.data_type)
		form.append('signature_version', options.signature_version)
		form.append('signature', signature)
		form.append('timestamp', timestamp)

		const res = await fetch('http://' + options.host + options.endpoint, {
			method: 'POST',
			body: form,
		})
		const { status, metadata } = await res.json()
		if (status.msg != 'Success')
			return await message.sendMessage(status.msg, { quoted: message.data })
		const { album, release_date, artists, title } = metadata.music[0]
		await message.sendMessage(
                          await genHydratedButtons(
					[
						{
							urlButton: {
								text: 'sᴜᴘᴘᴏʀᴛ ɢʀᴏᴜᴘ',
								url: 'https://chat.whatsapp.com/GI1czKTYIyN9r1yjbmirB3',
							},
						},
						{ button: { id: 'play'+ `${title}` , text: 'ᴅᴏᴡɴʟᴏᴀᴅ ᴛʜɪs sᴏɴɢ' } },
						{ button: { id: 'song'+ `${title}` , text: 'sᴇʟᴇᴄᴛ sᴏɴɢ' } },
					],
					`*Title :* ${title}
*Album :* ${album.name || ''}
*Artists :* ${
				artists !== undefined ? artists.map((v) => v.name).join(', ') : ''
			}
*Release Date :* ${release_date}`,
				`©𝐌𝐄𝐓𝐑𝐎-𝐁𝐎𝐓`
            ),
            {},
            'template'
        ) 
 }
);

bot(
	{
		pattern: 'play ?(.*)',
		fromMe: true,
		desc: 'Download youtube audio',
		type: 'download',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match) return await message.sendMessage('_Example : play oombalum kanjiyum_')
		const result = await yts(match)
		const { title } = await y2mate.get(result[0].id)
		await message.sendMessage(`_Downloading ${title}_`)
		await message.sendFromUrl(await y2mate.dl(result[0].id, 'audio'))
	}
)
