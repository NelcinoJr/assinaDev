## 2026-10-21

**Scope:**
- Assinatura eletrônica **simples**: a plataforma registra o hash (SHA-256) do PDF e gera um QR code; não há assinatura criptográfica nem certificado ICP-Brasil.
- O PDF original **não é alterado**. O QR code é entregue como imagem separada (download na tela e anexo em e-mail); o emissor decide onde colocá-lo.
- O hash registrado é o do PDF original enviado.
- A plataforma **guarda o PDF e o hash**.
- O QR code contém uma URL pública de validação com identificador aleatório, não sequencial e não adivinhável.
- A página aberta pelo QR code entra neste item, mostrando os dados da assinatura (emissor, data e hora, nome do arquivo). Os estados de validade (válido, inválido, revogado, não encontrado) ficam no 0040.
- Identificação do emissor sem conta: nome e e-mail, com confirmação por link. A assinatura só passa a valer depois da confirmação.
- O link de confirmação expira em 24 h; assinaturas não confirmadas nesse prazo são descartadas.
- Após a confirmação, o emissor recebe por e-mail o QR code anexado e o link de validação.
- PDFs protegidos por senha são aceitos (o hash é calculado sobre o arquivo, sem precisar abri-lo).
- Fora do escopo: upload de vários PDFs de uma vez (um arquivo por assinatura).

**Users:** Emissor sem conta (na época do refinamento, o login viria depois), identificado por nome e e-mail confirmado. Quem escaneia o QR code é a pessoa que recebeu o documento.

**Edge cases:**
- Arquivo acima de 10 MB: recusado com mensagem clara.
- Arquivo que não é PDF (extensão trocada, conteúdo corrompido): recusado.
- Mesmo PDF enviado de novo: gera um novo registro de assinatura, com novo QR code, data e emissor.
- Link de confirmação expirado ou já usado: informa o estado e não ativa a assinatura.
- QR code escaneado antes da confirmação do e-mail: a página informa que a assinatura ainda não foi confirmada.

**Constraints:**
- Assinatura simples tem valor probatório menor (Lei 14.063/2020); a garantia depende da integridade da plataforma.
- Limite de 10 MB por arquivo.
- PDFs e dados pessoais armazenados exigem controle de acesso e cuidado com LGPD (ver DoD).

**Open questions:**
- O item ficou grande (upload, confirmação por e-mail, QR, página, e-mail com anexo). Avaliar `/pbl-split` antes de implementar.
- O Card do 0040 (validar via QR code) precisa ser reescrito para refletir que a página já existe neste item e o 0040 cuida dos estados de validade.
- Qualquer pessoa com o QR consegue baixar o PDF guardado, ou a página mostra só os metadados? (afeta LGPD e o 0050)
- Por quanto tempo PDFs e registros ficam guardados.

## 2026-10-21 — reordenação do backlog

O item passou de 0010 para 0030. "Conta e login do emissor" (0010) e "Histórico e trilha de auditoria" (0020) vêm antes dele. "Listar documentos assinados" e "Múltiplos signatários" foram removidos.

**Open questions:**
- Com o login entregue antes, a identificação por nome e e-mail confirmado continua necessária, ou o emissor passa a ser o usuário logado? Se mudar, re-refinar e ajustar o `Confirmation.md`.
- Guardar o PDF tinha como motivo o download pela listagem, que foi removida. Rever se ainda faz sentido guardar o arquivo ou só o hash.
- O histórico (0020) vem antes da assinatura existir; avaliar se o 0020 deve vir depois deste item.
