# Definition of Done

O incremento está pronto quando todos os itens abaixo forem verdadeiros.

## Funcional

- [ ] Todos os critérios de aceite do `Confirmation.md` foram atendidos
- [ ] A funcionalidade pode ser demonstrada para os stakeholders em homologação
- [ ] Não há defeitos conhecidos abertos para o item

## Qualidade

- [ ] Testes automatizados cobrem os critérios de aceite e passam no CI
- [ ] Os fluxos de assinatura e validação têm teste de ponta a ponta
- [ ] O código foi revisado e aprovado por pelo menos uma pessoa além do autor

## Segurança e integridade

- [ ] Uploads aceitam apenas PDFs válidos, dentro do limite de tamanho definido
- [ ] Qualquer alteração em um PDF assinado faz a validação apontar o documento como inválido
- [ ] Documentos e chaves não ficam acessíveis sem autorização (nem por URL adivinhável)
- [ ] Nenhum segredo (chave, senha, token) está versionado no repositório

## Dados pessoais (LGPD)

- [ ] A página pública de validação mostra só os dados necessários para confirmar a autenticidade
- [ ] Dados pessoais coletados têm finalidade clara para o item

## Operação

- [ ] O incremento está publicado no ambiente de homologação (staging)
- [ ] Operações de assinatura, validação e revogação geram registro de auditoria
- [ ] A página de validação funciona no celular, já que o QR code é escaneado pelo telefone

## Documentação

- [ ] O README e as decisões relevantes (ADRs em `docs/adr/`) estão atualizados
