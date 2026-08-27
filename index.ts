import {instantiateWrapper} from "~/infrastructure/telegram"
import { GetGroup } from "./src/infrastructure/telegram/pooling";

(async () => {
    await instantiateWrapper();
   await GetGroup()
})()