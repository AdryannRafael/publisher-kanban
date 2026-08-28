import { DatabaseException } from "./exceptions";
import { SpecificityError } from "./specificity";

export async function chamarBanco<T>(func: () => Promise<T>): Promise<T> {
  try {
    return await func();
  } catch (e: any) {
    if (e instanceof Error) {
      console.error(e)
    }
    const exception = new DatabaseException(e.message, SpecificityError.UNKNOW);
    console.log("Erro ao usar o banco de dados - CODIGO: ", exception.erro.code());
    throw exception;
  }
}
export async function chamarWhatsApp<T>(func: Function): Promise<T> {
  try {
    return await func();
  } catch (e: any) {
    const exception = new DatabaseException(e.message, SpecificityError.UNKNOW);
    console.log("Erro ao chamar integração com WhatsApp - CODIGO: ", exception.erro.code());
    throw exception;
  }
}
