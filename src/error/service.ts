// import { notficarErro } from "~/infrastructure/whatsapp";
import { SystemException } from "./SystemException";

// export function tratarErro(e: unknown) {
//   if (e instanceof SystemException) {
//     // gravarErroNoBanco(e)
//     // .catch(() => {})
//     // .finally(() =>
//     mandarMsgParaMimNoGrupo(e)
//       .catch((e: unknown) => console.log(e))
//       .finally(() => console.log(""));
//     // );
//     return console.log(`Erro conhecido, segurando aplicação, codigo do erro: ${e.erro.code()}`);
//   }
//   notficarErro("❗❗URGENTE❗❗\n ☹️O Julius vai cair!\n CORRE🔎")
//     .catch((e: unknown) => console.log(e))
//     .finally(() => console.log(""));
//   mandarMsgParaMimNoGrupo(e as Error)
//     .catch((e: unknown) => console.log(e))
//     .finally(() => console.log(""));
//   // );
//   console.log(`Erro desconhecido, derrubando a aplicação, causa`);

//   throw e;

//   // Printar no console
//   // Salvar erro no banco
//   // Me notificar via WhatsApp
// }

// async function mandarMsgParaMimNoGrupo(e: SystemException | Error) {
//   await notficarErro(montarMensagemErro(e));
// }

async function gravarErroNoBanco(e: SystemException) { }

function montarMensagemErro(error: SystemException | Error): string {
  const mensagem = error.message || "Erro desconhecido";
  const stackRaw = error.stack || "Sem stack trace";

  // Limpa o caminho absoluto de TODAS as linhas do stack trace
  const stackLimpo = stackRaw
    .split("\n")
    .map((linha: string) => {
      // Remove o caminho até chegar na pasta do projeto ou pastas padrão do Node
      // Se não encontrar o padrão, mantém a linha original (mas sem o C:\Users...)
      return linha.replace(/.*?(core|infrastructure|src|node_modules)/, "$1").replace(/\\/g, "/"); // Padroniza barras para estilo Web
    })
    .join("\n");

  const data = new Date().toLocaleString("pt-BR");

  var codigo: string | null = null;
  if (error instanceof SystemException) {
    codigo = error.erro.code();
  }
  return [
    `🚨 *JULIUS ERROR REPORT* 🚨`,
    "",
    `📑 *Código:* \`${codigo ? codigo : "Erro não catalogado"}\``,
    `📝 *Mensagem:* _${mensagem}_`,
    "",
    `📂 *Stack Trace:*`,
    `\`\`\`text`,
    stackLimpo,
    `\`\`\``,
    "",
    `🕒 _${data}_`,
  ].join("\n");
}
