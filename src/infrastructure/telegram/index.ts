import type { BotAuthParams, UserAuthParams } from "telegram/client/auth";
import {env} from "@/enviroment"
import input from "input";
import { StringSession } from "telegram/sessions";
import { Api, TelegramClient } from "telegram";

export let client: TelegramClient;

const configurationConnection = {
    connectionRetries: 5,
    // 1. Força o processamento de TODOS os updates na ordem, sem pular nada
    sequentialUpdates: true,
    // 2. Tenta manter a conexão mais "agressiva" para evitar o modo standby
    floodSleepThreshold: 60,
    // 3. Aumenta o tempo de espera para respostas do servidor
    timeout: 30000,
};

export async function InstantiateWrapper(){

    const sessionLoaded = env.TELEGRAM_SESSION;
    
    let session: StringSession 
    session = new StringSession(sessionLoaded);
    
    const telegram = new TelegramClient(session, +env.TELEGRAM_API_ID, env.TELEGRAM_API_HASH!, configurationConnection);
     if(!sessionLoaded) {
        const sessionString = await getAuthKey(telegram, await mountParams());
        console.log("Auth Key:", sessionString);
        session = new StringSession(sessionString);
    }

    await telegram.connect();
    
    const state = await telegram.invoke(new Api.updates.GetState());
    // console.log(`🔄 Estado atual da sincronização: PTS ${state.pts}`);
    await telegram.getMe();
    await telegram.getDialogs({});
    client = telegram;
    console.log("✅ CONEXÃO COM TELEFRAM RELAIZA COM SUCESSO");
}

async function getAuthKey(client: TelegramClient, params: UserAuthParams | BotAuthParams) {
    await client.start(params);
    await client.connect();
    

    /* Retornando codigo gerado para iniciarmos a sessão */
    const sessionString = client.session.save() as any

    await client.disconnect();
    return sessionString as string;
}

async function mountParams(){
    const params: UserAuthParams | BotAuthParams = {
        phoneNumber: env.TELEGRAM_PHONE_NUMBER,
        phoneCode: async () => input.text(`Escreva aqui o codigo e autenticação enviado no telegram de numero ${env.TELEGRAM_PHONE_NUMBER}: -> `),
        onError: (e) => console.error(e),
    };
    return params;
}


 async function GetDialogsWithFolder(folderName: string) {
    const folders = await client.invoke(new Api.messages.GetDialogFilters());
    const pasta = folders.filters
        .filter((folder): folder is Api.DialogFilter => folder.className === Api.DialogFilter.className)
        .find((folder) => folder.title.text === folderName);
    if(!pasta) throw new Error(`Pasta com nome ${folderName} não encontrada`);
    
    for (const entitys of pasta.includePeers) {
        const channel = entitys as any;
            console.log(`🔹 Canal: ${channel.channelId} - ${channel.accessHash} - ${channel.peerId}`);
        }
            
}
