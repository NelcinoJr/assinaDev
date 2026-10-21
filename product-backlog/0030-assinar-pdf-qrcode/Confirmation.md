# Acceptance Criteria

O emissor deve conseguir:
- enviar um único arquivo PDF de até 10 MB, informando nome e e-mail
- enviar um PDF protegido por senha e ter a assinatura registrada normalmente
- receber um e-mail com um link de confirmação válido por 24 horas
- confirmar o e-mail pelo link e, a partir desse momento, ter a assinatura válida
- baixar na tela a imagem do QR code depois da confirmação
- receber por e-mail o QR code anexado e o link de validação depois da confirmação
- enviar o mesmo PDF de novo e receber um novo QR code, diferente do anterior
- usar a página de upload e a de validação em um celular com tela de 360px de largura

O sistema deve:
- recusar arquivos acima de 10 MB com a mensagem "O arquivo excede o limite de 10 MB"
- recusar arquivos que não sejam PDF válidos (extensão trocada ou conteúdo corrompido) com a mensagem "Envie um arquivo PDF válido"
- recusar o envio de mais de um arquivo por vez
- calcular o hash SHA-256 do arquivo original e guardá-lo junto com o PDF, sem alterar o arquivo
- gerar um identificador aleatório e não sequencial para cada assinatura, e codificar no QR code a URL pública de validação com esse identificador
- ao abrir a URL do QR code, mostrar o nome do emissor, a data e hora da assinatura e o nome do arquivo
- ao abrir a URL antes da confirmação do e-mail, informar que a assinatura ainda não foi confirmada
- não mostrar o e-mail do emissor na página pública de validação
- informar que o link expirou quando a confirmação acontecer depois de 24 horas, e descartar essa assinatura
- informar que o link já foi usado quando ele for aberto pela segunda vez
- registrar em auditoria o envio do arquivo, a confirmação do e-mail e cada acesso à página de validação
- retornar "não encontrado" para identificadores inexistentes, sem revelar se outros identificadores existem
- não permitir o acesso ao PDF guardado por uma URL adivinhável
