# Impulse — Analytics e acompanhamento comercial

## Escopo desta implementação

- Mantém o site estático (HTML/CSS/JS) e seus endpoints existentes, sem alterar plataforma, cadastro, pagamentos ou NDA.
- O container web `GTM-WB79J4DC` está configurado em `analytics-config.js` na branch de reformulação. **Isso ainda não publica o site nem garante coleta:** a tag `G-TZWBL4PJZF` precisa ser criada e publicada dentro do GTM, e o PR precisa ser homologado e publicado no domínio de produção.
- O carregador `analytics.js` exige consentimento explícito; não carrega GTM antes do aceite. Recusar não faz solicitação a provedores de análise.
- O carregador só roda em `useimpulse.com.br` e `www.useimpulse.com.br`; não envia dados de Preview, GitHub Pages alternativo ou localhost.

## IDs e ativação do GA4 (28/10/2026)

1. Propriedade GA4 e fluxo Web já criados pelo responsável pelo produto. **ID de medição: `G-TZWBL4PJZF`**.
2. Container Web do Google Tag Manager criado. **ID do container: `GTM-WB79J4DC`**, inserido em `analytics-config.js` na branch `feature/site-commercial-redesign`.
3. **Pendente no painel do Tag Manager:** abra o container; Tags → Nova → tipo **Tag do Google** → ID da tag `G-TZWBL4PJZF` → acionador **Initialization – All Pages** → Salvar. Não instalar um segundo snippet `gtag.js` no HTML.
4. **Pendente para os eventos de funil:** para cada evento da tabela abaixo, crie uma tag **Google Analytics: evento do GA4**, vinculada à propriedade `G-TZWBL4PJZF`, com acionador **Evento personalizado** cujo nome corresponde exatamente ao evento em `dataLayer`. Adicione apenas os parâmetros permitidos, nunca campos de formulário.
5. **Pendente:** validar em Tag Assistant/Pré-visualizar e GA4 DebugView; confirmar recusa (zero solicitações ao Google), aceite (carregamento do GTM e eventos), revogação (sem novas medições). O container só é carregado com aceite prévio; é um modelo básico de consentimento. Não adicionar tags publicitárias sem nova revisão de privacidade.
6. **Pendente:** enviar/publicar a versão do container GTM somente após testes e conformidade de consentimento. Fazer merge e publicação do site no domínio real só após homologação; o código impede envio de dados em Preview/outros domínios.
7. Habilitar e validar Search Console, se desejado.

**Nunca instalar a tag duas vezes.** O GTM é carregado pelo script com consentimento e é nele que a tag GA4 precisa ser configurada. GTM e GA4 gratuitos nas versões básicas; anúncios pagos e extensões comerciais não fazem parte deste trabalho.

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
5. Com ID GTM configurado no código: em Preview, localhost e domínios alternativos, nenhum request ao Google; no domínio público, **sem consentimento não carregar**.
6. No domínio público, com GTM real publicado: aceite carrega; recusa/revogação não carregam em novas visitas. Confirmar a mesma regra para todos os eventos via DebugView.
7. Formulário continua a exigir Turnstile e mantém tratamento de falha.
8. Visual e contraste devem ser verificados no navegador antes de publicar na `main`.

## Observações comerciais

Os limites e preços exibidos foram preservados da versão atual e devem continuar sincronizados com `lib/public-plans.ts` na plataforma. Foi detectado texto de BYOK no registro da aplicação, apesar do modo gerenciado existir. Alinhar essa mensagem na plataforma em revisão separada antes da divulgação em escala.
