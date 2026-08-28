import type { Entity } from "telegram/define";
import {client} from "./index"
import {env} from "@/enviroment"
import { Api } from "telegram";
import type { Dialog } from "telegram/tl/custom/dialog";
import {setTimeout, setInterval,} from "node:timers/promises"
import type { CollectInfoMessage } from "~/infrastructure/pipeline";


let group:Api.Channel

export async function* StartPooling():AsyncGenerator<CollectInfoMessage>{
    console.log("🔄 Iniciando pooling de tarefas...");
    const {channel, chat} = await GetGroup();
    group = channel;
    
    await OpenChat();
    
    const timing = 1000 * 10; // 1 minuto
    
    for await (const _ of setInterval(timing)){
        yield* await GetMessagesUnread(chat)
    }
    // yield* await setInterval(timing, await GetMessagesUnread(chat))
}





async function GetMessagesUnread(chat: Dialog) {
    const lastMessageId = chat.dialog.readInboxMaxId;
    const totalUnread = chat.unreadCount;
    const unreadMessages: CollectInfoMessage[] = []
    for await (const message of client.iterMessages(chat.entity, {minId: lastMessageId, limit: totalUnread})) {
        unreadMessages.push({
            texto: message.text,
            date: new Date()
        });
    }
    return unreadMessages.reverse();
}

async function OpenChat(){
    await client.invoke(
        new Api.channels.GetFullChannel({
        channel: group,
        }),
    );
}

type GroupInfo = {
    channel: Api.Channel
    chat: Dialog
}

export async function GetGroup(): Promise<GroupInfo>{
    const inputEntity = await client.getInputEntity(env.TELEGRAM_GROUP_TAREFA)
    const dialogs = await client.getDialogs({});
    const chat = dialogs
        .filter((dialog) => (dialog.isChannel || dialog.isGroup) && dialog.title?.includes("Fazenda"))
        .find((dialog) => {
            const bigIntGrou = BigInt(`${dialog.isChannel ? "-100" : ""}${env.TELEGRAM_GROUP_TAREFA}`);
            return dialog.id?.compareTo(bigIntGrou) === 0
        });
    if(!chat){
        throw new Error(`Grupo de tarefas não encontrado: ${env.TELEGRAM_GROUP_TAREFA}`)
    }
    
    const channel = await client.getEntity(inputEntity) as Api.Channel;
    return {
        channel,
        chat
    } 
}
