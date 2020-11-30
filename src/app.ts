import 'dotenv/config';
import fs from 'fs';
import dgram from 'dgram';
import { Node } from "./objects/Node";
import { INode } from "./interfaces/INode";
import { NodeRole } from "./enums/NodeRoles";
import { shuffle } from "./utils/Utils";
import { ISentMessage } from './interfaces/ISentMessage';
import readLine from 'readline';

const server = dgram.createSocket({ type: 'udp4' });
const allNodes: INode[] = [];
const nodeId: number = Number.parseInt(process.argv[2]);
const nodeRole: string = process.argv[3];
const configData = fs.readFileSync('./src/assets/input.txt', { encoding: 'utf8' }).toString();
const isAuthority = nodeRole && nodeRole === NodeRole.AUTH;
const canLamportStart = { status: false };
const localLamportClock = { count: 0 };
const nodeActions = { count: 0 };

const PORT = 20000;
const MULTICAST_ADDR = '224.0.0.114';

let nodeData: INode;

configData.split('\n').forEach((line, index) => {
  if (index === 0) return;
  const data = line.split(' ');

  const newNode = {
    id: Number.parseInt(data[0]),
    host: data[1],
    port: Number.parseInt(data[2]),
    chance: Number.parseFloat(data[3])
  };

  allNodes.push(newNode);

  if (newNode.id == nodeId) {
    nodeData = newNode;
  }

});

server.bind(nodeData.port, nodeData.host);

server.on('listening', () => {
  const address = server.address();
  console.log(`Listening ${address.address}:${address.port}`);
  // // server.bind(PORT);
  server.addMembership(MULTICAST_ADDR, nodeData.host);
});


server.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);

  const messageToString = msg.toString();
  const parsedMessage = JSON.parse(messageToString);

  console.log('PARSED: ', parsedMessage);
  //mensagem de broadcast:
  //{ status: 1, info: 'broadcast' };

  console.log(messageToString);

  if (parsedMessage.status === 'multicast') {
    canLamportStart.status = true;

    console.log('multicast caralhooooo');
  }

  if (parsedMessage.status === 'send') {
    console.log('hora de escrever no arquivo');
    const receivedMessage = {
      m: Date.now(),
      i: `${nodeData.id}`,
    };
  }

});

  const randomNumber = Math.floor(Math.random() * 11);
  const randomNode = shuffle(allNodes.map(node => node.id))[0];
  const chosenNode = allNodes.find(node => node.id === randomNode);

  if (randomNumber >= chosenNode.chance * 10) {
    //Incrementa relogio
    localLamportClock.count++;

    const objectOfLocalMessage = {
      status: 'local',
      m: Date.now(),
      i: nodeData.id,
      c: `${localLamportClock.count}${nodeData.id}`
    };

    const message = `${objectOfLocalMessage.m} ${objectOfLocalMessage.i} ${objectOfLocalMessage.c}\n`;

    fs.writeFile(`output_${nodeData.id}`, message, { flag: 'a' }, function (err) {
      if (err) throw err;
    });

  } else {
    // envia mensagem para o nodo sorteado

    const objectOfMessage = {
      status: 'send',
      m: Date.now(),
      i: nodeData.id,
      c: `${localLamportClock.count}${nodeData.id}`,
      d: chosenNode.id
    }

    const message = `${objectOfMessage.m} ${objectOfMessage.i} ${objectOfMessage.c} ${objectOfMessage.d}\n`;

    fs.writeFile(`output_${nodeData.id}`, message, { flag: 'a' }, function (err) {
      if (err) throw err;
      console.log("It's saved!");
    });

    const jsonStrinfied = JSON.stringify(objectOfMessage);

    server.send(Buffer.from(jsonStrinfied), chosenNode.port, chosenNode.host, (error) => {
      if (error) {
        console.log('Erro ao enviar mensagem para o nodo.')
        throw error;
      } else {
        console.log('deu tudo certo com o envio de mensagem');
      }
    });
  }


console.log('FIM!');

let input = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

var recursiveReadLine = function () {
  input.question('Se você é o lider, digite: \'broadcast\' para enviar a mensagem para todos os conectados. Caso contrário, aguarde.\n\n', function (answer) {
    input.pause();
    if (answer.toLowerCase() == 'broadcast' && isAuthority) {
      console.log('Broadcastou pra geral');

      const multicastMessage = { status: 'multicast' };
      const stringfied = JSON.stringify(multicastMessage);

      //MULTICAST AINDA NÃO ESTÁ OK
      //server.send(Buffer.from(stringfied), 20000, 'endereco_broadcast');
      // return;
    } else {
      console.log('Não tem permissão para executar isso!');
    }

    recursiveReadLine();
  });
}

recursiveReadLine();

function sendMessage(node: Node, message: ISentMessage): void {
  const buffer = Buffer.from(JSON.stringify(message))
  server.send(buffer, node.port, node.host)
}