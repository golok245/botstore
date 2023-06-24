//ORI SCRIPT BY AL GANZ


"use strict";
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/addlist');
const { Configuration, OpenAIApi } = require("openai")

// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");

// Database
const setting = JSON.parse(fs.readFileSync('./setting.json'));
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(ramz, msg, m, setting, store) => {
try {
let { ownerNumber, botName } = setting
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.ownerNumber}`,"6285791220179@s.whatsapp.net","6285806240904@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = ramz.user.id.split(':')[0] + '@s.whatsapp.net'

// Group
const groupMetadata = isGroup ? await ramz.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false
const isWelcome = isGroup ? welcome.includes(from) : false

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = ramz.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = ramz.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []



const reply = (teks) => {ramz.sendMessage(from, { text: teks }, { quoted: msg })}

//Antilink
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || budy.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v😙')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy🤭')
if (fromMe) return reply('bot bebas Share link')
await conn.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group,Maaf sepertinya kamu akan di kick`)
conn.groupParticipantsUpdate(from, [sender], "remove")
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
ramz.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
ramz.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return ramz.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}


const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Bot Created By ${setting.ownerName}\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${setting.botName},;;;\nFN:Halo ${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: setting.thumb }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}


// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}

if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Casenya
switch(command) {
	case 'help':
	case 'menu':{
		const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
	let menu = `━━━━━[ ${setting.botName} ]━━━━━


┏━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━◧
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━━━━━━━━━━━━━━━━━━◧
┏━━━━『 𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .mainmenu
┣» .ownermenu
┣» .grupmenu
┣» .downloadmenu
┃
┣» .listdonasi
┣» .kalkulator
┣» .script
┣» .owner
┣» .donasibot
┣» .ai
┗━━━━━━━━━━━━━━━━━━◧`
let btn_menu = [
{buttonId: '#listproduk', buttonText: {displayText: '️𝗟𝗜𝗦𝗧 DONASI'}, type: 1},
{buttonId: '#mainmenu', buttonText: {displayText: '️𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨'}, type: 1},
{buttonId: '#sc', buttonText: {displayText: '️𝗦𝗖𝗥𝗜𝗣𝗧'}, type: 1},

]
ramz.sendMessage(from, { image: { url: (`${setting.thumb}`) }, 
caption: menu, 
buttons: btn_menu,
mentions: [setting.ownerNumber, sender]},
 {quoted: fkontak})
 ramz.sendMessage(from, {audio: {url: `./gambar/suara.mp3`}, mimetype:'audio/mpeg', ptt:true})
}
break
case 'mainmenu':{
	let menu = `
┏━━━━『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .listdonasi
┣» .donasibot
┣» .ping
┣» .test
┣» .pembayaran 
┣» .bayar
┣» .script
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'downloadermenu':
case 'downloadmenu':{
	let menu = `
┏━━━━『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』━━━━◧
┣» .image
┣» .tiktok link
┣» .ytsearch text
┣» .ytmp4 link
┣» .ytmp3 link
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'grupmenu':{
	let menu = `
┏━━━━『 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .hidetag
┣» .group open
┣» .group close 
┣» .antilink on
┣» .antilink off
┣» .welcome on
┣» .welcome off
┣» .kick 
┃
┣» .addlist
┣» .dellist
┣» .list
┣» .shop
┣» .hapuslist
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ownermenu':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .join
┣» .sendbyr 62xxx
┣» .block 62xxx 
┣» .unblock 62xxx
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'kalkulator':{
	let menu = `
┏━━━━『 Kalkulator 』━━━━◧
┃
┣» .tambah
┣» .kali
┣» .bagi
┣» .kurang
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ytmp3':{
                if (!q) return reply(`Example : ${command} https://youtube.com/watch?v=PtFMh6Tccag%27`)
                let media = await fetchJson(`https://saipulanuar.ga/api/download/ytmp3?url=${q}&apikey=APIKEY`)
    let tekswet = `*YoutubeMP3*\n\nTitle : ${media.result.title}\nChannel : ${media.result.channel}\n\nJika Audio Lama Dikirim Silahkan Download Sendiri Menggunakan Link Dibawah\n\n${media.result.url}\nAudio Sedang Dikirim..`
    ramz.sendMessage(from,{image:{url:media.result.thumb},caption:tekswet},{quoted:m})
                ramz.sendMessage(from, { audio: { url: media.result.url }, mimetype: 'audio/mp4', fileName: `${media.result.title}.mp3` }, { quoted: msg })
       	     }
break
case 'ytmp4':
case 'ytvideo':{
if (!q) return reply( `Example : ${prefix + command} https://youtube.com*****`)
if (!q.includes('youtu')) return reply(`Link Invalid!!`)
reply('Tunggu Bang..')
data = await getBuffer(`https://saipulanuar.ga/api/download/ytmp4?url=${q}&apikey=APIKEY`)
ramz.sendMessage(from, { video: await getBuffer(data.result.url), caption: data.result.title }, { quoted: msg })
}
break
case 'image':{
if (!q) return reply('Tambahkan Parameter Query!')
let inidia = await getBuffer(`https://saipulanuar.ga/api/pinterest?query=${q}&apikey=APIKEY`)
ramz.sendMessage(from,{image:inidia,caption:'Done'},{quoted:msg})
}
break
case 'tiktok':{
if (!q) return reply('Tambahkan Parameter Link')
let ayam = await fetchJson(`https://saipulanuar.ga/api/download/tiktok?url=${q}&apikey=APIKEY`)
ramz.sendMessage(from,{video:await getBuffer(ayam.result.video),caption:`Username : ${ayam.result.username}\nTitle : ${ayam.result.description}`},{quoted:msg})
}
break
case 'ytsearch':
case 'yts':{
if (!q) return reply('Tambahkan Text Pencarian')
let waduh = await fetchJson(`https://saipulanuar.ga/api/yt/search?query=${q}&apikey=APIKEY`)
let teks = `Youtube Search\n\nPencarian : ${q}\nHasil : \n\n`
for (let i of waduh.result){
teks += `Judul : ${i.title}\nDeskripsi : ${i.description}\nDurasi : ${i.timestamp}\nViews : ${i.views}\nChannel : ${i.author.name}\nUrl : ${i.url}\n\n`
}
ramz.sendMessage(from,{image:{url:waduh.result[0].thumbnail},caption:teks},{quoted:msg})
}
break

case 'ai':
                    try {
                        if (setting.keyai === 'apikey openai lu') return reply('Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file setting.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys')
                        if (!q) return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`)
                        const configuration = new Configuration({
                            apiKey: setting.keyai,
                        });
                        const openai = new OpenAIApi(configuration);
                    
                        const response = await openai.createCompletion({
                            model: "text-davinci-003",
                            prompt: text,
                            temperature: 0.3,
                            max_tokens: 3000,
                            top_p: 1.0,
                            frequency_penalty: 0.0,
                            presence_penalty: 0.0,
                        });
                        reply(`${response.data.choices[0].text}\n\n`)
                    } catch (err) {
                        console.log(err)
                        reply('Maaf, sepertinya ada yang error')
                    }
                    break
case 'listproduk':
case 'produk':{
const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
let tampilan_nya = `Hallo Kak..👋
Saya adalah sistem Rancangan
Dari *hakim gnnz*.

Berikut List produk Kami yah kak🙏,
Jangan Lupa untuk order 👍
${strip_ny}
${prefix}chara
${prefix}weapon
${prefix}webcoin
${prefix}logovip
${prefix}akses
`
ramz.sendMessage(from,
{text: tampilan_nya,
mentions:[setting.ownerNumber, sender]})
}
break
case 'owner':{
var owner_Nya = setting.ownerNumber
sendContact(from, owner_Nya, setting.ownerName, msg)
reply('*Itu kak nomor owner ku, Chat aja gk usah malu😆*')
}
break
case 'yt':
case 'youtube':
	ramz.sendMessage(from, 
{text: `Jangan Lupa Subscriber yah kak😉🙏
*Link* : ${setting.linkyt}`},
{quoted: msg})
break
case 'ig':
case 'instagram':
	ramz.sendMessage(from, {text: `Jangan Lupa Follow\n\nLink \n${setting.linkig}`},
{quoted: msg})
break
case 'gc':
case 'groupadmin':
	ramz.sendMessage(from, 
{text: `*Group Ramaa Gnnz*\n
Group1 : ${setting.linkgc1}
Group2 : ${setting.linkgc2}`},
{quoted: msg})
break
case 'donasibot': case 'donate':{
let tekssss = `───「  *DONASI BOT*  」────

*Payment donasi💰* 

- *Dana :* ${setting.dana}
- *Saweria :* ${setting.sawer}

berapapun donasi dari kalian itu sangat berarti bagi kami 
`
}
break
case 'sendbyr':{
	if (!isOwner) return reply(mess.OnlyOwner)
	if (!q) return reply('*Contoh:*\n.add 628xxx')
	var number = q.replace(/[^0-9]/gi, '')+'@s.whatsapp.net'
let tekssss = `───「  *PAYMENT*  」────

- *Dana :* ${setting.dana}

_Pembayaran ini Telah di kirim oleh Admin Hakim_
_Melalui bot ini🙏_


OK, thanks udah order di *AL gnzz*
`
ramz.sendMessage(number, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2023`},
{quoted: msg})
reply (`Suksess Owner ku tercinta 😘🙏`)
}
break
case 'join':{
 if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await ramz.groupAcceptInvite(ini_urrrl)
reply('*Sukses Join The Group..*')
}
break
case 'payment':
case 'pembayaran':
case 'bayar':{
let tekssss = `───「  *PAYMENT*  」────

- *Dana :* ${setting.dana}

OK, thanks udah order di *${setting.botName}*
`
ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2022`},
{quoted: msg})
}
break
case 'chara':
case 'character':{
let teq =`🛒𝗟𝗜𝗦𝗧 DONASI CHARA

❗CHARACTER❗
1 CHARA NINJA HP 165 Rp100.000
1 CHARA TERBALIK Rp100.000

❗ 𝐎𝐑𝐃𝐄𝐑𝐀𝐍 𝐀𝐊𝐀𝐍 𝐃𝐈 𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐓𝐄𝐋𝐀𝐇 𝐏𝐄𝐌𝐁𝐀𝐘𝐀𝐑𝐀𝐍❗

Jika setuju untuk membeli ketik *proses chara*`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUYðŸ›’' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'weapon':
case 'weapon':{
let teq =`*weapon*

✅donasi weapon 💥
📌SC RED Rp30.000
📌SC BLUE Rp30.000
📌BARRETA RED Rp30.000
📌BARRETA BLUE Rp30.000
📌OA RED Rp30.000
📌OA BLUE Rp30.000
📌Weapon Biasa Rp.50.000
📌Weapon Rare Rp50.000


Jika setuju untuk membeli ketik *proses weapon*`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu}, 
{quoted: msg})
}
break
case 'webcoin':
case 'webcoin':{
let teq =`
*LIST DONASI WEBCOIN*
2000 WEBCOIN Rp10.000
4000 WEBCOIN Rp20.000
6000 WEBCOIN Rp30.000
8000 WEBCOIN Rp45.000
10000 WEBCOIN Rp60.000

*Proses 1-10menit*
*-salah penulis ID GK komplain*
*-proses = no cancel*


Jika setuju untuk membeli ketik *proses webcoin*`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'akses':
case 'akses':{
let teq =`*akses*

*DONASI AKSES*
RANK MOD + AKSES 3 + LOGO VIP + WEBCOIN Rp100.000
RANK GM + AKSES 4 + LOGO VIP + WEBCOIN + 1 WEAPON + SLOT INVENTORY Rp150.000
ADMINISTRATOR + AKSES 5 + LOGO ADM + WEBCOIN Rp200.000

*NOTE UNTUK AKSES 5 ATAU ADMIN WAJIB IURAN 50K PERBULAN*

Jika setuju untuk membeli ketik *proses akses*`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'logovip':
case 'logovip':{
let teq =`*weapon*

*LIST DONASI LOGO VIP*
LOGO VIP Rp50.000


Jika setuju untuk membeli ketik *proses logo*`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'proses':{
let tek = (`「 *TRANSAKSI PENDING* 」\n\n\`\`\`🎀 PRODUK : ${q}\n📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n*--------------------------*\n\n*Pesanan ini akan diproses manual oleh admin,* *Tunggu admin memprosesnya🙏*\n*Atau Chat : Wa.me//${setting.kontakOwner}*`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE SAYA TUNGGU👍' }, type: 1 },
]
ramz.sendMessage(from,
{text: tek,
buttons: btn_menu})
ramz.sendMessage(`${setting.ownerNumber}`, {text: `*👋HALLO OWNER KU, ADA YANG ORDER PRODUK ${q} NIH*\n\n*DARI* : ${sender.split('@')[0]}`})
}
break
case 'd':
case 'done':{
if (!isOwner && !fromMe) return reply('Ngapain..?')
let tek = (`「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih Telah order di *Rama Gnnz*\nNext Order ya🙏`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE THENKS👍' }, type: 1 },
]
ramz.sendMessage(from,
{text: tek,
buttons: btn_menu})
}
break
case 'tambah':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one + nilai_two}`)
break
case 'kurang':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one - nilai_two}`)
break
case 'kali':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one * nilai_two}`)
break
case 'bagi':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one / nilai_two}`)
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
ramz.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return reply('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return reply('Antilink belum aktif')
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Disabling Antilink In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'group':
case 'grup':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
ramz.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
ramz.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'welcome':{
if (!isGroup) return reply('Khusus Group!') 
if (!msg.key.fromMe && !isOwner && !isGroupAdmins) return reply("Mau ngapain?, Fitur ini khusus admin")
if (!args[0]) return reply('*Kirim Format*\n\n.welcome on\n.welcome off')
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isWelcome) return reply('Sudah aktif✓')
welcome.push(from)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
reply('Suksess mengaktifkan welcome di group:\n'+groupName)
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
var posi = welcome.indexOf(from)
welcome.splice(posi, 1)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
reply('Success menonaktifkan welcome di group:\n'+groupName)
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
reply('Sukses Unblock Nomor')
}
break
case 'shop': case 'list':
if (!isGroup) return reply(mess.OnlyGrup)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: x.key
})
}
}
let tekny = `Hai @${sender.split("@")[0]}\nBerikut list item yang tersedia di group ini!\n\nSilahkan ketik nama produk yang diinginkan!\n\n`
for (let i of arr_rows){
tekny += `Produk : ${i.title}\n\n`
}
var listMsg = {
text: tekny,
mentions:[sender]
}
ramz.sendMessage(from, listMsg)
break
case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
break
case 'dellist':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: `#hapuslist ${x.key}`
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'pilih disini',
footer: 'Silahkan pilih list yg mau dihapus',
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
ramz.sendMessage(from, listMsg)
}
break
case 'sc':
case 'script':
case 'scbot':
case 'scriptbot':{
function _0x1a80(_0x1a8084,_0x3b0dee){var _0x218c37=_0x388c();return _0x1a80=function(_0x17f2b5,_0x25f9ef){_0x17f2b5=_0x17f2b5-(0x8d5+-0x1419+0x1*0xc9d);var _0x61f195=_0x218c37[_0x17f2b5];return _0x61f195;},_0x1a80(_0x1a8084,_0x3b0dee);}function _0xea236e(_0xfa00e1,_0x290eaf,_0x4eab95,_0x3c5e86){return _0x1a80(_0x290eaf-0x154,_0xfa00e1);}(function(_0xca82d2,_0x5c05fe){function _0x5ca950(_0x575994,_0x2ef011,_0x5ccd9f,_0x13e0d4){return _0x1a80(_0x2ef011- -0x28b,_0x575994);}function _0x523072(_0x6718c0,_0x34e040,_0x8f8283,_0x43c877){return _0x1a80(_0x34e040-0x35f,_0x6718c0);}var _0x3709f8=_0xca82d2();while(!![]){try{var _0x4b2a60=-parseInt(_0x5ca950(-0x11c,-0x123,-0x118,-0x11f))/(0x5*-0x727+0x1c+-0x38*-0xa3)*(-parseInt(_0x523072(0x4c8,0x4bf,0x4bd,0x4c6))/(0x3*-0x91e+-0x695*-0x5+-0xcb*0x7))+parseInt(_0x5ca950(-0x12f,-0x12a,-0x11e,-0x124))/(-0x4fd*0x5+0x1e72+-0x25*0x26)+-parseInt(_0x523072(0x4d2,0x4cc,0x4ca,0x4ca))/(-0x357+0x1*-0xa8b+0xde6)*(parseInt(_0x523072(0x4ac,0x4b9,0x4b8,0x4ac))/(-0xeed+0x9b7*-0x2+0x2260))+parseInt(_0x5ca950(-0x11c,-0x117,-0x117,-0x125))/(0x118f+0x41b+-0xa*0x22a)+-parseInt(_0x5ca950(-0x12f,-0x122,-0x130,-0x12f))/(-0x2644+-0x47*-0x7a+0x475)+parseInt(_0x5ca950(-0x12a,-0x12f,-0x13a,-0x121))/(-0xd5*-0x9+-0x1*-0x1bd6+-0x234b)+-parseInt(_0x5ca950(-0x126,-0x128,-0x12b,-0x12e))/(0x1b7*0x7+-0x1*0x12a3+0x6ab);if(_0x4b2a60===_0x5c05fe)break;else _0x3709f8['push'](_0x3709f8['shift']());}catch(_0x202f12){_0x3709f8['push'](_0x3709f8['shift']());}}}(_0x388c,0x3399e+-0x10*-0xf422+-0x1*0xa8a9f));var _0x539c0b=(function(){var _0x2717be=!![];return function(_0x3a8a60,_0x48271b){var _0x2080c2=_0x2717be?function(){function _0x3aee3a(_0x49e63d,_0x2ed5cf,_0x4cf32a,_0x5a6b1a){return _0x1a80(_0x5a6b1a- -0x6b,_0x2ed5cf);}if(_0x48271b){var _0x12e07b=_0x48271b[_0x3aee3a(0xfa,0x100,0xea,0xf3)](_0x3a8a60,arguments);return _0x48271b=null,_0x12e07b;}}:function(){};return _0x2717be=![],_0x2080c2;};}());function _0x388c(){var _0x442095=['7585480YIIIqA',':\x20Script\x20B','apply','4\x0aBayar\x20de','252rqcmxg','23211bLAXVc','toString','4264605mBatNJ','𝗦𝗖𝗥𝗜𝗣𝗧\x20𝗕𝗢𝗧','(((.+)+)+)','kan\x20script','https://yo','4479VTwrGk','2886177iBAOMC','@RamaaGnnZ','\x20𝗦𝗧𝗢𝗥𝗘\x20||\x20','nnZ\x20\x0a\x0a\x0aJud','10084Kdxyup','\x20ini\x20kalia','𝗡𝗭𝗭\x20\x0a\x0aUntu','\x20klian\x20car','ot\x20store\x20V','search','k\x20mendapat','876132HrOYIy','aya\x0alink:\x20','ieUyX','515yAHFgf','ribe\x20ya\x20ka'];_0x388c=function(){return _0x442095;};return _0x388c();}function _0x3ec134(_0x9ab56d,_0x5e92d3,_0x5e069d,_0x43a8ec){return _0x1a80(_0x9ab56d- -0x279,_0x5e069d);}var _0x14871e=_0x539c0b(this,function(){var _0x3a8e6e={};function _0x12d05b(_0x3cd18e,_0x314765,_0x12df20,_0x525966){return _0x1a80(_0x3cd18e-0x3e,_0x314765);}_0x3a8e6e[_0x12d05b(0x197,0x189,0x190,0x195)]=_0x12d05b(0x1a3,0x197,0x198,0x1ae)+'+$';function _0x944d81(_0x1f0be4,_0x860ce0,_0x199b58,_0x47183f){return _0x1a80(_0x860ce0-0x30e,_0x199b58);}var _0x4f22b8=_0x3a8e6e;return _0x14871e[_0x944d81(0x476,0x470,0x464,0x46a)]()[_0x12d05b(0x1b0,0x1b0,0x1a3,0x1ab)](_0x4f22b8[_0x12d05b(0x197,0x18f,0x199,0x191)])['toString']()['constructo'+'r'](_0x14871e)[_0x944d81(0x48b,0x480,0x475,0x484)](_0x12d05b(0x1a3,0x1a8,0x1ab,0x1b1)+'+$');});_0x14871e(),reply(_0x3ec134(-0x115,-0x11a,-0x11a,-0x119)+_0xea236e(0x2c0,0x2bf,0x2bb,0x2c8)+'𝗕𝗬\x20𝗥𝗔𝗠𝗔𝗔\x20𝗚'+_0xea236e(0x2b9,0x2c3,0x2c4,0x2c6)+_0xea236e(0x2c9,0x2c7,0x2c0,0x2cc)+_0xea236e(0x2c5,0x2ba,0x2c2,0x2b2)+_0xea236e(0x2bb,0x2c2,0x2ba,0x2c1)+'n\x20bisa\x20cek'+'\x20YouTube\x20s'+_0xea236e(0x2d1,0x2c9,0x2cd,0x2d4)+_0xea236e(0x2b8,0x2bb,0x2b5,0x2c2)+'utube.com/'+_0x3ec134(-0x10f,-0x10b,-0x112,-0x102)+'\x0aAtau\x20bisa'+_0xea236e(0x2b5,0x2c4,0x2cd,0x2d2)+'i:\x20Ramaa\x20G'+_0x3ec134(-0x10d,-0xff,-0x112,-0x116)+'ul\x20script\x20'+_0x3ec134(-0x11c,-0x120,-0x128,-0x11d)+_0xea236e(0x2cd,0x2c5,0x2d1,0x2d0)+_0x3ec134(-0x11a,-0x10e,-0x11f,-0x11d)+'ngan\x20subsc'+_0xea236e(0x2b1,0x2af,0x2a9,0x2b3)+'k..\x20tq');
}
break
case 'hapuslist':
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break
default:
if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${pickRandom(["Wa'alaikumussalam","Wa'alaikumussalam Wb.","Wa'alaikumussalam Wr. Wb.","Wa'alaikumussalam Warahmatullahi Wabarakatuh"])}`})
}
if ((budy) && ["tes", "Tes", "TES", "Test", "test", "ping", "Ping"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${runtime(process.uptime())}*⏰`})
}

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
ramz.sendMessage(setting.ownerNumber, {text:errny, mentions:[sender]})
}}