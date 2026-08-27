import dotenv from "dotenv";
import path from "path";

const envFilePathSymbol = Symbol("ENV_FILE");

const constants = {
    [envFilePathSymbol]: ".env"
}

dotenv.config({ path: path.join(process.cwd(), constants[envFilePathSymbol]) });

interface Enviroment {
  TELEGRAM_SESSION: string;
  TELEGRAM_API_ID: string;
  TELEGRAM_API_HASH: string;
  TELEGRAM_PHONE_NUMBER: string;
  TELEGRAM_GROUP_TAREFA: string;
}

export const env: Enviroment = {
    TELEGRAM_SESSION: getEnvOrThrow('TELEGRAM_SESSION', false) || "",
    TELEGRAM_API_ID: getEnvOrThrow('TELEGRAM_API_ID'),
    TELEGRAM_API_HASH: getEnvOrThrow('TELEGRAM_API_HASH'),
    TELEGRAM_PHONE_NUMBER: getEnvOrThrow('TELEGRAM_PHONE_NUMBER'),
    TELEGRAM_GROUP_TAREFA: getEnvOrThrow('TELEGRAM_GROUP_TAREFA'),
}

function getEnvOrThrow<T = string>(key: keyof Enviroment, throwable: boolean = true): T {
    const value = process.env[key];
    if(throwable && (value == undefined || value === null || value === "")){
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value as unknown as T;
}