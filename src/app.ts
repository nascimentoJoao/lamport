import 'dotenv/config';
import fs from 'fs';
import dgram from 'dgram';
import { Node } from "./objects/Node";
import { INode } from "./interfaces/INode";
import { NodeRole } from "./enums/NodeRoles";
import { shuffle } from "./utils/Utils";
import {ISentMessage} from './interfaces/ISentMessage';


const server = dgram.createSocket('udp4');
const allNodes: INode[] = [];
const nodeId : number = Number.parseInt(process.argv[2]);
const nodeRole : string = process.argv[3];
const configData = fs.readFileSync('./src/assets/input.txt', {encoding: 'utf8'}).toString();

server.bind(1234, () => server.addMembership('233.255.255.255'));

server.on('listening', () => {
  const address = server.address();
  console.log(`Listening ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

configData.split('\n').forEach((line, index) => {
  if (index === 0) return;
  
  const lineId = Number.parseInt(line.split(' ')[0]); 
  if (lineId === nodeId) return;

  const data = line.split(' ');
  allNodes.push(<INode> {
    id: Number.parseInt(data[0]),
    host: data[1],
    port: Number.parseInt(data[2]),
    chance: Number.parseFloat(data[3])
  });
});

if (nodeRole && nodeRole === NodeRole.AUTH) {
  broadcast(allNodes);
}

const randomNumber = Math.floor(Math.random() * 11);
const randomNode = shuffle(allNodes.map(node => node.id))[0];
const chosenNode = allNodes.find(node => node.id === randomNode);

if (randomNumber >= chosenNode.chance * 10) {
  //Incrementa relogio
  console.log(`Para chance ${randomNumber} contra a chance de nodo ${chosenNode.chance * 10}, INCREMENTA O RELOGIO.`);
} else {
  // envia mensagem para o nodo sorteado
  console.log(`Para chance ${randomNumber} contra o nodo de chance ${chosenNode.chance * 10}, ENVIA MENSAGEM PARA NODO SORTEADO.`);
}

//Inicia execução

//Aguarda mensagem multicast sinalizando que pode iniciar

//Gera um número aleatorio entre 1 e 10
//Pega probabilidade, verifica o número sorteado
//0 1 2 3 4 5 6 7 8 9 - probabilidade de 0.4 -> 0, 1, 2, 3
// Se aleatorio entre [0, 3] -> envia mensagem
// se aleatorio entre [4, 9] -> incrementa relogio

// for 0 .. 99 ->
// calcularAleatorio();
// verificarAcaoSerRealizada();
//    enviaMensagem() ou incrementaLamport();
//    m i c s d = 123219739123912 1 541  
/**
 * Envio de mensagem: m i c s d, onde m é o tempo do computador local em
milissegundos, i é o ID do nodo local, c é o valor do relógio lógico enviado
(relógio concatenado com o ID), d é o ID do nodo destinatário da mensagem;
 */



// var bucketParams = {
//   Bucket : process.env.AWS_BUCKET_NAME,
//   Key: process.env.AWS_OBJECT_NAME
// };

// const awsService : S3 = AwsClient.getInstance().service;

// // Call S3 to obtain a list of the objects in the bucket
// awsService.getObject(bucketParams, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log(data.Body.toString());
//   }
// });

function sendMessage(node: Node, message: ISentMessage): void {
  const buffer = Buffer.from(JSON.stringify(message))
  server.send(buffer, node.port, node.host)
}