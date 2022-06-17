

var whatsapp = async () => {

    const { Client, LocalAuth } = require('whatsapp-web.js');

    const qrcode = require('qrcode-terminal');

    const client = new Client({ authStrategy: new LocalAuth({ clientId: "client-one" }) })
    var messages = [], calls = [], myMessages = [], simplified = []

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('message', msg => {

        messages.push({
            ack: msg.ack,
            author: msg.author,
            body: msg.body,
            broadcast: msg.broadcast,
            deviceType: msg.deviceType,
            duration: msg.duration,
            forwardingScore: msg.forwardingScore,
            from: msg.from.split("@")[0],
            fromMe: msg.fromMe,
            hasMedia: msg.hasMedia,
            hasQuotedMsg: msg.hasQuotedMsg,
            id: msg.id.id,
            inviteV4: msg.inviteV4,
            isEphemeral: msg.isEphemeral,
            isStatus: msg.isStatus,
            isStarred: msg.isStarred,
            isGif: msg.isGif,
            links: msg.links,
            location: msg.location,
            mediaKey: msg.mediaKey,
            mentionedIds: msg.mentionedIds,
            orderId: msg.orderId,
            timestamp: msg.timestamp,
            to: msg.to.split("@")[0],
            token: msg.token,
            type: msg.type,
            vCards: msg.vCards
        })

        require("fs").writeFileSync(`whatsapp/messages.json`, JSON.stringify(messages, null, 2))

        simplified.push({
            body: msg.body,
            from: msg.from.split("@")[0],
            to: msg.to.split("@")[0],
            timestamp: msg.timestamp,
            type: msg.type,
            date: new Date(msg.timestamp * 1000)
        })

        // chats by number messages
        require("fs").writeFileSync(`whatsapp/contact/${msg.from.split("@")[0]}.json`, JSON.stringify(simplified, null, 2))

        // text
        if (msg.body == 'زوجي') client.sendMessage(msg.from, 'اه حبيبتي');
        else if (msg.body == 'كيفك؟' || msg.body == 'كيفك حبب' || msg.body == 'kfk?' || msg.body == 'kfk' || msg.body == 'kfk hbb' || msg.body == 'kfk 7bb') client.sendMessage(msg.from, 'تمام حبب إنت كيفك؟');
        else if (msg.body == 'شو أخبارك؟' || msg.body == 'شو أخبارك' || msg.body == 'shu a5brk' || msg.body == 'shu a5barak' || msg.body == 'shu a5barak?') client.sendMessage(msg.from, 'حبب كلو تمام، إنت وين أيامك');
        else if (msg.body == 'bro') client.sendMessage(msg.from, 'Hello bro, Eh 7bb elle?');
        else if (msg.body == 'slm' || msg.body == 'salam' || msg.body == 'سلام') client.sendMessage(msg.from, 'هلا حبب وعليكم السلام، كيفك؟');

    });

    // calls
    client.on('incoming_call', call => {

        calls.push({
            from: call.from.split("@")[0],
            fromMe: call.fromMe,
            id: call.id,
            isGroup: call.isGroup,
            isVideo: call.isVideo,
            participants: call.participants,
            timestamp: call.timestamp,
            outgoing: call.outgoing,
            webClientShouldHandle: call.webClientShouldHandle
        })

        require("fs").writeFileSync(`whatsapp/chat.json`, JSON.stringify(calls, null, 2))

        simplified.push({
            from: msg.from.split("@")[0],
            to: msg.to.split("@")[0],
            timestamp: msg.timestamp,
            type: "call",
            date: new Date(msg.timestamp * 1000)
        })

        // chats by number messages
        require("fs").writeFileSync(`whatsapp/contact/${msg.from.split("@")[0]}.json`, JSON.stringify(simplified, null, 2))
    })

    // calls
    client.on('call', call => {

        console.log(call);
        calls.push(call)
        require("fs").writeFileSync(`whatsapp/calls.json`, JSON.stringify(calls, null, 2))
    })

    // created messages
    client.on('message_create', msg => {

        var type = msg.type
        if (msg.type === "ptt") type = "call"

        myMessages.push({
            ack: msg.ack,
            author: msg.author,
            body: msg.body,
            broadcast: msg.broadcast,
            deviceType: msg.deviceType,
            duration: msg.duration,
            forwardingScore: msg.forwardingScore,
            from: msg.from.split("@")[0],
            fromMe: msg.fromMe,
            hasMedia: msg.hasMedia,
            hasQuotedMsg: msg.hasQuotedMsg,
            id: msg.id.id,
            inviteV4: msg.inviteV4,
            isEphemeral: msg.isEphemeral,
            isStatus: msg.isStatus,
            isStarred: msg.isStarred,
            isGif: msg.isGif,
            links: msg.links,
            location: msg.location,
            mediaKey: msg.mediaKey,
            mentionedIds: msg.mentionedIds,
            orderId: msg.orderId,
            timestamp: msg.timestamp,
            to: msg.to.split("@")[0],
            token: msg.token,
            type: msg.type,
            vCards: msg.vCards
        })

        require("fs").writeFileSync(`whatsapp/messages.json`, JSON.stringify(myMessages, null, 2))

        simplified.push({
            body: msg.body,
            from: msg.from.split("@")[0],
            to: msg.to.split("@")[0],
            timestamp: msg.timestamp,
            type,
            date: new Date(msg.timestamp * 1000)
        })

        // chats by number messages
        require("fs").writeFileSync(`whatsapp/contact/${msg.from.split("@")[0]}.json`, JSON.stringify(simplified, null, 2))
    })

    /* // send image base64
    sendMedia
    const media = new MessageMedia('image/png', base64Image);
    chat.sendMessage(media);
    */

    /* // send image from path
    const media = MessageMedia.fromFilePath('./path/to/image.png');
    chat.sendMessage(media);
    */

    /* // send image from URL
    const media = MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
    chat.sendMessage(media);
    */
    client.initialize();
}

  // whatsapp()
