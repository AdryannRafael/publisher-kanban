import {InstantiateWrapper} from "~/infrastructure/telegram"
import { StartPooling } from "./src/infrastructure/telegram/pooling";
import { pipeline } from "stream/promises";

(async () => {
    await InstantiateWrapper();
    pipeline(StartPooling, 
        
        readable
        // ,process.stdout
    )
})()


async function* readable(stream: AsyncGenerator){
    for await (const message of stream){
        console.log(message)
    }
}