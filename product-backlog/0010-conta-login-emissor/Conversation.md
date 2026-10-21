## 2026-10-21

**Scope:**
- Cadastro com **e-mail e senha** apenas (sem nome, sem CPF).
- **Sem confirmação de e-mail**: a conta fica ativa assim que é criada.
- Senha com no mínimo 8 caracteres, sem outras exigências de complexidade.
- Login com e-mail e senha; logout por um botão "Sair".
- A sessão dura até o navegador ser fechado (cookie de sessão, sem "lembrar de mim").
- Depois de logado, o cabeçalho mostra o e-mail do emissor e o botão "Sair". Não há página de área logada própria neste item.
- Fora do escopo: recuperação de senha, troca de senha, exclusão de conta, verificação em duas etapas, proteção contra tentativas repetidas, login social.

**Users:** Emissor, que cria a própria conta. Neste item não há outros perfis (administrador, equipe).

**Edge cases:**
- E-mail já cadastrado: o cadastro é recusado.
- E-mail em formato inválido ou senha com menos de 8 caracteres: cadastro recusado com mensagem do campo.
- E-mail com maiúsculas e minúsculas diferentes é tratado como o mesmo e-mail.
- E-mail ou senha errados no login: mensagem genérica, sem dizer qual dos dois está errado.
- Acesso a página protegida sem estar logado: redireciona para o login.
- Usuário já logado que abre a página de login ou de cadastro: é levado para a página inicial.

**Constraints:**
- Senhas guardadas apenas como hash forte (bcrypt ou argon2), nunca em texto.
- Formulários protegidos contra CSRF; cookie de sessão `HttpOnly`, `Secure` e `SameSite`.

**Open questions:**
- **Risco de fraude assumido**: sem confirmação de e-mail, qualquer pessoa pode se cadastrar com o e-mail de outra e assinar em nome dela. Isso contraria a dor central do produto; rever antes de ir para produção.
- **Risco de força bruta assumido**: sem limite de tentativas, a senha pode ser descoberta por tentativa e erro.
- Sem recuperação de senha, quem esquecer a senha perde a conta e o acesso às assinaturas.
- A página de validação do 0030 mostrava o nome do emissor, mas o cadastro não pede nome. Mostrar o e-mail contraria a DoD (LGPD). Decidir no re-refinamento do 0030 o que aparece como "assinado por".
- A mensagem "e-mail já cadastrado" revela que a conta existe. Aceito por simplicidade.
