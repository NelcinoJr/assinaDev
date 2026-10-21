# Acceptance Criteria

O emissor deve conseguir:
- criar uma conta informando e-mail e senha, e ficar logado logo em seguida
- entrar com e-mail e senha cadastrados
- ver o próprio e-mail e o botão "Sair" no cabeçalho enquanto estiver logado
- sair pelo botão "Sair" e voltar para a página de login
- usar as páginas de cadastro e de login em um celular com tela de 360px de largura

O sistema deve:
- recusar o cadastro com e-mail em formato inválido, com a mensagem "Informe um e-mail válido"
- recusar senha com menos de 8 caracteres, com a mensagem "A senha deve ter pelo menos 8 caracteres"
- recusar o cadastro com e-mail já existente, com a mensagem "Este e-mail já está cadastrado"
- tratar "Fulano@Email.com" e "fulano@email.com" como o mesmo e-mail
- guardar a senha apenas como hash (bcrypt ou argon2), nunca em texto
- recusar login com e-mail ou senha errados, com a mensagem "E-mail ou senha incorretos", sem indicar qual dos dois está errado
- encerrar a sessão quando o navegador for fechado
- redirecionar para o login quem acessar uma página protegida sem estar logado
- levar para a página inicial quem já está logado e abre o login ou o cadastro
- impedir que uma sessão encerrada pelo "Sair" seja reutilizada
- recusar envios de formulário sem token CSRF válido
- emitir o cookie de sessão com as opções HttpOnly, Secure e SameSite
- registrar em auditoria cadastros, logins com sucesso, logins com falha e logouts
