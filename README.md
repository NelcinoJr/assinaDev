# assinaDev

Sistema de assinatura digital que permite fazer o upload de arquivos no formato `.pdf` e possibilita a validação via QR code para identificar se é uma assinatura válida.

## Produto

- **Usuário principal:** emissor — quem emite e assina documentos.
- **Problema central:** documentos falsificados ou adulterados circulam e ninguém consegue verificar com facilidade.
- **Tipo de assinatura:** eletrônica simples — hash SHA-256 do PDF original + QR code com URL de validação (decidido no refinamento de "Assinar PDF com QR code", hoje 0030).

## Product Backlog

O backlog é gerenciado com [pbl-skills](https://github.com/mariomelo/pbl-skills) e vive em [`product-backlog/`](product-backlog/). Cada item passa pelo pipeline dos 3 Cs: `Card.md` (raw) → `Conversation.md` (refined) → `Confirmation.md` (ready).

| # | Item | Status |
|---|------|--------|
| 0010 | [Conta e login do emissor](product-backlog/0010-conta-login-emissor/Card.md) | READY — [conversa](product-backlog/0010-conta-login-emissor/Conversation.md) · [critérios de aceite](product-backlog/0010-conta-login-emissor/Confirmation.md) |
| 0020 | [Histórico e trilha de auditoria](product-backlog/0020-historico-auditoria/Card.md) | RAW |
| 0030 | [Assinar PDF com QR code](product-backlog/0030-assinar-pdf-qrcode/Card.md) | READY — [conversa](product-backlog/0030-assinar-pdf-qrcode/Conversation.md) · [critérios de aceite](product-backlog/0030-assinar-pdf-qrcode/Confirmation.md) |
| 0040 | [Validar assinatura via QR code](product-backlog/0040-validar-via-qrcode/Card.md) | RAW |
| 0050 | [Detectar adulteração do PDF](product-backlog/0050-detectar-adulteracao-pdf/Card.md) | RAW |
| 0060 | [Revogar assinatura](product-backlog/0060-revogar-assinatura/Card.md) | RAW |

Itens removidos (em [`product-backlog/.removed-items/`](product-backlog/.removed-items/), podem ser restaurados): Listar documentos assinados, Múltiplos signatários.

### 0010 — Conta e login do emissor

Como emissor,
quero criar uma conta e entrar com login seguro,
para que somente eu consiga assinar documentos em meu nome.

### 0020 — Histórico e trilha de auditoria

Como emissor,
quero ver o histórico de cada documento (quem assinou, quando e quantas validações teve),
para que eu tenha prova em caso de contestação.

### 0030 — Assinar PDF com QR code

Como emissor,
quero fazer upload de um PDF e assiná-lo,
para que eu receba uma versão assinada com QR code para distribuir.

### 0040 — Validar assinatura via QR code

Como pessoa que recebeu o documento,
quero escanear o QR code e ver se a assinatura é válida,
para que eu saiba se o documento é autêntico.

### 0050 — Detectar adulteração do PDF

Como pessoa que recebeu o documento,
quero enviar o PDF que tenho em mãos e conferir se ele é idêntico ao original assinado,
para que eu detecte adulteração, mesmo quando o QR code foi copiado para um documento falso.

### 0060 — Revogar assinatura

Como emissor,
quero revogar a assinatura de um documento,
para que ele passe a aparecer como inválido na validação.

## Definition of Done

O incremento está pronto quando todos os itens abaixo forem verdadeiros. Fonte: [`product-backlog/definition-of-done.md`](product-backlog/definition-of-done.md).

**Funcional**

- [ ] Todos os critérios de aceite do `Confirmation.md` foram atendidos
- [ ] A funcionalidade pode ser demonstrada para os stakeholders em homologação
- [ ] Não há defeitos conhecidos abertos para o item

**Qualidade**

- [ ] Testes automatizados cobrem os critérios de aceite e passam no CI
- [ ] Os fluxos de assinatura e validação têm teste de ponta a ponta
- [ ] O código foi revisado e aprovado por pelo menos uma pessoa além do autor

**Segurança e integridade**

- [ ] Uploads aceitam apenas PDFs válidos, dentro do limite de tamanho definido
- [ ] Qualquer alteração em um PDF assinado faz a validação apontar o documento como inválido
- [ ] Documentos e chaves não ficam acessíveis sem autorização (nem por URL adivinhável)
- [ ] Nenhum segredo (chave, senha, token) está versionado no repositório

**Dados pessoais (LGPD)**

- [ ] A página pública de validação mostra só os dados necessários para confirmar a autenticidade
- [ ] Dados pessoais coletados têm finalidade clara para o item

**Operação**

- [ ] O incremento está publicado no ambiente de homologação (staging)
- [ ] Operações de assinatura, validação e revogação geram registro de auditoria
- [ ] A página de validação funciona no celular, já que o QR code é escaneado pelo telefone

**Documentação**

- [ ] O README e as decisões relevantes (ADRs em `docs/adr/`) estão atualizados

## Decisões em aberto

- **QR code × adulteração:** o QR code prova que a assinatura existe, mas não que o PDF em mãos é o original. O item 0050 pode precisar ser entregue junto com o 0040.
- **Tamanho do 0030:** o item ficou grande após o refinamento; avaliar `/pbl-split` antes de implementar.
- **Card do 0040:** reescrever — a página de validação já nasce no 0030; o 0040 cuida dos estados de validade.
- **Login antes da assinatura:** o 0030 foi refinado com emissor sem conta (nome + e-mail confirmado). Com o login no 0010, rever essa identificação.
- **"Assinado por" sem nome:** o cadastro do 0010 pede só e-mail e senha; decidir no 0030 o que a página pública mostra sem expor o e-mail.
- **Riscos assumidos no 0010:** sem confirmação de e-mail (alguém pode se cadastrar com o e-mail de outra pessoa), sem proteção contra força bruta e sem recuperação de senha. Rever antes de produção.
- **Guardar o PDF:** o motivo era o download pela listagem, que foi removida. Rever se basta guardar o hash.
- **Histórico (0020) antes de existir assinatura:** avaliar se ele deve vir depois do 0030.
- **Download do PDF pela página pública** e **prazo de retenção** dos documentos.

## Fluxo de trabalho

Skills disponíveis em `.cursor/skills/`:

- `/pbl-refine` — refinar o item do topo (3 Cs)
- `/pbl-add` — adicionar um novo item
- `/pbl-split` — dividir um item grande (Método Hambúrguer)
- `/pbl-implement` — passar de um item refinado para código
- `/pbl-diagnose` — analisar a saúde do backlog
- `/pbl-done` — marcar um item como concluído

Depois de qualquer mudança no backlog, regenere o índice:

```
node scripts/pbl-index.js
```
