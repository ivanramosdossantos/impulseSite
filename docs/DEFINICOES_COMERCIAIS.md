# Impulse Ask — Definições comerciais (16/10/2026)

Documento de referência para próximas evoluções comerciais e implementação. Valores de lançamento propostos; validar custos reais e viabilidade técnica antes de disponibilizar contratação automatizada.

## Planos mensais

| Plano | Preço | Usuários | Consultas válidas/mês | Aplicações incluídas | Aplicações adicionais permitidas |
|---|---:|---:|---:|---:|---:|
| Individual | R$ 149,90 | 1 | 200 | 1 | Até 4 |
| Equipe | R$ 599,00 | Até 5 | 1.000 | 3 | Até 7 |
| Profissional | R$ 1.990,00 | Até 20 | 4.000 | 8 | Até 12 |
| Enterprise | Sob proposta | Personalizado | Personalizado | Personalizado | Negociado |

## Adicional de aplicações

- R$ 49,90 por aplicação adicional por mês, recorrente.
- O adicional aumenta apenas a quantidade de aplicações; não aumenta usuários ou consultas.
- Total de aplicações = inclusas no plano + adicionais contratadas.
- Mensalidade simulada = valor do plano + (R$ 49,90 × aplicações adicionais).
- Limites máximos totais sugeridos: Individual 5, Equipe 10, Profissional 20.
- Acima dos tetos, negociar Enterprise.

## Definição funcional

- Aplicação é a unidade comercial: um sistema/produto que pode reunir múltiplos repositórios relacionados (por exemplo, frontend e backend).
- Repositórios não são necessariamente equivalentes a aplicações.
- Limites técnicos de tamanho de código, número de repositórios por aplicação, indexação e frequência de reindexação ainda precisam ser definidos e implementados.
- Franquia contabiliza consultas concluídas com resposta válida; falhas sem resposta válida não devem consumir a franquia, conforme política final.

## Pendências antes de vender automaticamente

1. Implementar e validar enforcement de usuários, aplicações, consultas e limites técnicos no backend.
2. Confirmar custo real por aplicação, indexação, armazenamento e reprocessamento para validar o adicional de R$ 49,90.
3. Definir cobrança, upgrades/downgrades, pró-rata, cancelamentos e política de excedentes.
4. Confirmar fluxo de contratação, implantação, termos comerciais e integração com pagamentos.
5. Formulário do site atualmente usa mailto; não equivale a captura backend de leads.

## Simulação ROI pública

- Custo mensal de investigação = profissionais × horas semanais × custo/hora × 52/12.
- Economia hipotética = custo mensal × percentual de redução escolhido pelo visitante.
- Saldo potencial = economia hipotética − mensalidade.
- ROI hipotético = saldo potencial / mensalidade × 100.
- Não é promessa de resultados e não inclui implantação, treinamento ou outros custos indiretos.
