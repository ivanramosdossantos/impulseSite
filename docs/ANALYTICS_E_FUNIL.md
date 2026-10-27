# Impulse — Analytics e acompanhamento comercial

## Escopo desta implementação

- Mantém o site estático (HTML/CSS/JS) e seus endpoints existentes, sem alterar plataforma, cadastro, pagamentos ou NDA.
- A coleta de dados **não está ativa** até ser preenchido um ID real em `analytics-config.js`.
- O carregador `analytics.js` exige consentimento explícito; não carrega GTM antes do aceite. Recusar não faz solicitação a provedores de análise.
- O carregador só roda em `useimpulse.com.br` e `www.useimpulse.com.br`; não envia dados de Preview, GitHub Pages alternativo ou localhost.

## Ativação futura do GA4

1. Criar a propriedade GA4 e um **fluxo Web** para `https://useimpulse.com.br` em analytics.google.com.
2. Criar um **container Web** no Google Tag Manager (GTM).
3. Dentro do GTM, configurar a tag Google Analytics para o ID de medição real (G-...) e disparadores para os eventos descritos abaixo. Configurar consentimento e conferir pré-visualização do Tag Assistant.
4. Substituir a string vazia de `window.IMPULSE_GTM_ID` no arquivo `analytics-config.js` pelo **ID do container GTM-...**. Não colocar IDs G-... nessa variável.
5. Testar no domínio público: recusar, aceitar, voltar às preferências e revogar. Confirmar no modo de depuração do GA4 que só há eventos após aceite.
6. Habilitar e validar o Search Console; conectar ao GA4 opcionalmente.

**Não cadastrar IDs fictícios em produção.** GTM e GA4 gratuitos nas versões básicas; anúncios pagos e extensões comerciais não fazem parte deste trabalho.

## Eventos implementados no SITE

| Evento dataLayer | Situação | Parâmetros permitidos |
|---|---|---|
| `trial_click` | clique em links do trial | `location`: hero/demo/pricing/final |
| `demo_view` | troca de pergunta na demonstração fictícia | `scenario`: pedido/desconto/integracao |
| `pricing_view` | primeira visualização do bloco de preços | nenhum |
| `contact_click` | clique em links de contato | `location` |
| `generate_lead` | resposta positiva ao envio do formulário de contato | `method: site_contact` |

Não enviar e-mails, nomes, telefones, mensagens, textos das perguntas, repositórios, hashes de código, tokens ou outros dados pessoais/segredos para o Google.

## Parte ainda NÃO implementada (outro repositório)

Para acompanhar cadastro → ativação → pagamento **sem lacunas**, serão necessários eventos autenticados em `ivanramosdossantos/impulse-platform`, após validação da governança de consentimento e do escopo organizacional:

- `sign_up`: cadastro concluído, sem dados pessoais;
- `application_connected`: aplicação conectada sem nome ou URL;
- `first_ask_completed`: primeira consulta concluída, sem conteúdo da pergunta/resposta;
- `trial_activated`: critério de ativação definido pelo produto;
- `purchase`: contratação confirmada no backend, evitando eventos duplicados, sem dados financeiros sensíveis.

Esses eventos não foram simulados no site. O backoffice e o banco continuam fontes oficiais do uso e das vendas. A atribuição entre domínio principal e subdomínio da aplicação só poderá ser validada quando a plataforma utilizar a mesma propriedade e respeitar o consentimento.

## Segurança e privacidade

- Nenhum endpoint foi adicionado ou flexibilizado. Formulário de contato atual continua com Turnstile e requisitos de proteção do backend.
- Preferências ficam no `localStorage` do site. Revogação interrompe carregamento nas visitas seguintes e recarrega a página caso uma tag esteja ativa, limpando cookies de análise acessíveis.
- Revisar políticas de cookies, termos, consentimento, retenção e base legal com responsável pela LGPD antes de ativar a medição.
- Não utilizar replay de sessão ou captura automática de dados de formulário.
- O HTML do site é público por natureza. Qualquer API com dados privados requer autenticação e autorização server-side, inclusive isolamento entre organizações.

## Testes de aceite

1. Homepage e páginas `/suporte-tecnico/` e `/gestao-de-ti/` acessíveis.
2. Navegação desktop/mobile, CTA do trial, planos e contato intactos.
3. Demonstração troca as três perguntas e os exemplos sem nenhuma requisição externa.
4. Linguagem de marketing consistente; respostas demonstrativas explicitamente fictícias.
5. Sem GTM configurado: nenhum request ao Google e preferências ocultas.
6. Com GTM real: sem consentimento não carregar; aceite carrega; recusa/revogação não carregam em novas visitas.
7. Formulário continua a exigir Turnstile e mantém tratamento de falha.
8. Visual e contraste devem ser verificados no navegador antes de publicar na `main`.

## Observações comerciais

Os limites e preços exibidos foram preservados da versão atual e devem continuar sincronizados com `lib/public-plans.ts` na plataforma. Foi detectado texto de BYOK no registro da aplicação, apesar do modo gerenciado existir. Alinhar essa mensagem na plataforma em revisão separada antes da divulgação em escala.
