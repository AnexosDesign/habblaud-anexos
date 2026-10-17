# Simulação Anexos

Esta demonstração é local e determinística: não lê sessões, credenciais ou produção, não instala hooks, não envia mensagens e inicia com o Habblaud World desligado.

```sh
npm install
npm run demo:anexos
```

Abra `http://127.0.0.1:4747`, sem parâmetros na URL. Clique nos personagens para a etapa atual, eventos e contagens simuladas.

- **Sincronização Shopee:** aguarda nova execução; início, leitura e espera simulados.
- **Triagem de conversas:** apenas classifica e registra; não encaminha para outro agente. Exibe conclusão e erro sanitizado de exemplo.

O contrato futuro, ainda não conectado, é: `routineId`, `executionId`, `stage`, `status` (`waiting | running | completed | failed`), `occurredAt`, `counts: {name,value,unit}[]` e `sanitizedError?`. O adaptador validará e converterá esses dados apenas para o snapshot local; nunca para o Habblaud World.

## Investigação e decisões

O Habblaud original reúne arquivos de sessão de Claude Code e Codex no servidor Node, atualiza o modelo `Office` e entrega snapshots via SSE. Já `?mock=1` executa o `DemoSimulator` no navegador. Para este teste, `AnexosSimulator` é um terceiro caminho: gera o mesmo snapshot, mas não depende de sessão, SSE externo, credenciais, Worker, prompt executável ou World.

O servidor Node continua necessário para servir a aplicação pela raiz, sem parâmetros; o canvas, os personagens e o painel de detalhes seguem funcionando no navegador. A futura conexão entrará como um adaptador que produza o contrato acima, sem modificar os observadores originais de Claude/Codex.

Regras de Worker e prompt permanecem propositalmente distintos: a sincronização futura usará regras de código determinísticas para normalizar eventos de pedido; a triagem terá um prompt proposto apenas para classificação e registro. Ela nunca acionará encaminhamento para outro agente.
