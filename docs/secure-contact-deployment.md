# Formulário comercial seguro — implantação

## Status
Implementado em branch, **não publicado**. O endpoint anterior da plataforma continua desativado. A criação do projeto Vercel separado foi recusada com HTTP 403 (sem permissão). Não efetuar merge nem ativar envios antes de concluir a infraestrutura e a validação.

## Arquitetura
Site público GitHub Pages -> Vercel Function isolada (`api/contact.js`) -> Resend. Não usa Supabase Auth ou credenciais da plataforma. A rota é pública, mas somente executa envio após Turnstile + limites persistentes. Origin é controle adicional, não autenticação.

## Configuração obrigatória do projeto Vercel do site
- Vincular `ivanramosdossantos/impulseSite` a um **novo** projeto Vercel, sem reutilizar o `impulse-platform`.
- Definir `TURNSTILE_SECRET_KEY` exclusivamente no servidor.
- Definir `RESEND_API_KEY` exclusivamente no servidor, preferencialmente chave exclusiva do site.
- Definir `CONTACT_TO_EMAIL` como endereço comercial fixo.
- Definir `CONTACT_FROM_EMAIL` como endereço em domínio verificado no Resend.
- Definir `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` para Redis persistente e `CONTACT_IP_HASH_SALT` com valor aleatório secreto.
- Somente após homologação, definir `CONTACT_SENDING_ENABLED=true`.
- No HTML publicado pelo GitHub Pages, configurar `window.IMPULSE_CONTACT_API_URL` com a URL definitiva e verificada `https://<host-vercel>/api/contact`, antes da execução do script do formulário. Enquanto ausente, o HTML aponta para `/api/contact` no próprio host (não funciona no GitHub Pages).
- Registrar o hostname `useimpulse.com.br` no Turnstile e assegurar `data-action=contact`.
- Configurar rate limit complementar do WAF Vercel conforme tráfego. Redis impõe 3/h por IP, 3/d por e-mail e 30/d global; são limites conservadores a revisar após dados reais.

## Verificação direcionada antes da ativação (sem adicionar suíte nova)
1. Endpoint responde 405 para GET e 403 para POST sem Origin válido; sem permitir envio.
2. Token Turnstile ausente, reutilizado, inválido ou para outro hostname/action é rejeitado.
3. Redis indisponível ou variável obrigatória ausente leva a 503 e nenhum e-mail.
4. Validar 429 após esgotar cotas, inclusive entre instâncias serverless.
5. Com Turnstile válido, testar um envio para **destinatário comercial fixo** com autorização explícita e verificar Resend/telemetria. Nunca usar emails arbitrários.
6. Confirmar comportamento de sucesso, erro e idiomas no site, inclusive reset do Turnstile.

## Observações
- O endpoint recebe requisições públicas por desenho; nenhum CAPTCHA garante que um visitante seja confiável.
- O uso de `x-forwarded-for` pressupõe normalização por proxy confiável da Vercel; validar essa premissa em deployment antes de ativar.
- Logs mostram códigos e categorias de erro sem dados de visitantes.
- Não armazenar segredos em GitHub Pages ou HTML.
