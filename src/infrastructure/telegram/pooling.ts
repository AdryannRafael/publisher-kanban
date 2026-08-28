import type { Entity } from "telegram/define";
import {client} from "./index"
import {env} from "@/enviroment"
import { Api } from "telegram";
import type { Dialog } from "telegram/tl/custom/dialog";
import {setTimeout, setInterval} from "node:timers/promises"
import type { CollectInfoMessage } from "~/infrastructure/pipeline";



export async function* StartPooling():AsyncGenerator<CollectInfoMessage>{
    const timing = 1000 * 6 //* 1; // 1 minuto
    
    for await (const _ of setInterval(timing)){
        console.log("Buscando mensagens...")
        
        const {channel, chat} = await GetGroup();
        await OpenChat(channel);
        yield* GetMessagesUnread(channel, chat)
    }
}


async function* GetMessagesUnread(group:Api.Channel,chat: Dialog) {
    const lastMessageId = chat.dialog.readInboxMaxId;
    const totalUnread = chat.unreadCount;
    
    /* retornando um array vazio caso não haja nenhuma mensagem não lida */
    if(totalUnread === 0){
        return []
    }

    // const unreadMessages: CollectInfoMessage[] = []
    for await (const message of client.iterMessages(chat.entity, {minId: lastMessageId, limit: totalUnread})) {
        const isTask = IdentifyMessageIsTask(message);
        if(isTask){
            const m = await message.getReplyMessage();
            if(m){
                // unreadMessages.push(
                const r: CollectInfoMessage = {
                    texto: m.text,
                    date: new Date()
                }
                yield r
            }
        }
    }
    // return unreadMessages.reverse();
}

function IdentifyMessageIsTask(message: Api.Message): boolean{
    const isTask = message.text === "@TAREFA"
    if(message.replyTo && isTask){
       return true 
    }
    return false
}

async function OpenChat(group:Api.Channel){
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
