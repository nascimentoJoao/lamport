# lamport
Terceiro trabalho da disciplina de Programação Distribuída.

O trabalho foi realizado utilizando Typescript e NodeJS. O envio de mensagens e comunicação em multicast foi realizado com o dgram.
Para executar a solução, compile o código com ```tsc``` e execute com:

```user$ node dist/app.js <id> <role> <config>```

Sendo ```id``` um valor entre 1 e 5, ```role``` algum dos valores: ["auth", "std"] e ```config``` como: ["local", "vm"].
O nodo que iniciar com role = auth é responsável por iniciar a execução do algoritmo distribuído. Ou seja, é necessário instanciar pelo menos um "auth" antes de iniciar a execução.

Uma vez subida as instâncias, digite no terminal do nodo auth: "multicast" e observe a execução iniciar. Cada nodo vai executar 100 ações aleatórias, entre envio de mensagens e eventos locais. Eventos locais são incrementos ao relógio lógico de Lamport.

Existe uma pasta ```assets``` no projeto que contém os arquivos de configuração. Altere o conteúdo desses arquivos com endereços que façam sentido para sua rede local.
