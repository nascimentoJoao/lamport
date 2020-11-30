"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const dgram_1 = __importDefault(require("dgram"));
const NodeRoles_1 = require("./enums/NodeRoles");
const Utils_1 = require("./utils/Utils");
const readline_1 = __importDefault(require("readline"));
const server = dgram_1.default.createSocket({ type: 'udp4' });
const multicast = dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true });
const allNodes = [];
const nodeId = Number.parseInt(process.argv[2]);
const nodeRole = process.argv[3];
const environment = process.argv[4];
const file = { name: 'input.txt' };
if (environment === 'vm') {
    file.name = 'input-vm.txt';
}
const configData = fs_1.default.readFileSync(`./src/assets/${file.name}`, { encoding: 'utf8' }).toString();
const isAuthority = nodeRole && nodeRole === NodeRoles_1.NodeRole.AUTH;
const canLamportStart = { status: false };
const localLamportClock = { count: 0 };
const PORT = 30000;
const MULTICAST_ADDR = '224.0.0.114';
let nodeData;
(function parseNodes() {
    configData.split('\n').forEach((line, index) => {
        if (index === 0)
            return;
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
})();
(function serverStart() {
    server.bind(nodeData.port, nodeData.host);
    multicast.bind(PORT);
    server.on('listening', () => {
        const address = server.address();
        console.log(`Listening ${address.address}:${address.port}`);
    });
    multicast.on('listening', () => {
        multicast.addMembership(MULTICAST_ADDR);
    });
    multicast.on('message', (msg, rinfo) => __awaiter(this, void 0, void 0, function* () {
        // console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);
        const parsedMessage = JSON.parse(msg.toString());
        if (parsedMessage.status === 'multicast') {
            canLamportStart.status = true;
            for (let i = 0; i < 100; i++) {
                const randomTimeout = between(500, 1000);
                yield sleep(randomTimeout);
                startNodeAction();
            }
            return;
        }
    }));
    server.on('message', (msg, rinfo) => {
        const messageToString = msg.toString();
        const parsedMessage = JSON.parse(messageToString);
        if (parsedMessage.status === 'multicast') {
            canLamportStart.status = true;
        }
        if (parsedMessage.status === 'send') {
            const receivedLamportClock = Number.parseInt(parsedMessage.c.slice(0, -1));
            if (receivedLamportClock > localLamportClock.count) {
                localLamportClock.count = receivedLamportClock + 1;
            }
            const receivedMessage = {
                m: Date.now(),
                i: `${nodeData.id}`,
                c: localLamportClock.count,
                s: parsedMessage.i,
                t: receivedLamportClock
            };
            const message = `${receivedMessage.m} ${receivedMessage.i} r ${receivedMessage.c} ${receivedMessage.s} ${receivedMessage.t}\n`;
            console.log(message);
            fs_1.default.writeFile(`output_${nodeData.id}`, message, { flag: 'a' }, function (err) {
                if (err)
                    throw err;
            });
        }
    });
})();
if (isAuthority) {
    recursiveReadLine();
}
function recursiveReadLine() {
    const input = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    input.question('Se você é o lider, digite: \'multicast\' para enviar a mensagem para todos os conectados. Caso contrário, aguarde.\n\n', function (answer) {
        if (answer.toLowerCase() == 'multicast' && isAuthority) {
            console.log(`Começando a sincronização!`);
            const multicastMessage = { status: 'multicast' };
            const stringfied = JSON.stringify(multicastMessage);
            server.send(Buffer.from(stringfied), PORT, MULTICAST_ADDR);
        }
        else {
            console.log('Não tem permissão para executar isso!');
        }
        recursiveReadLine();
    });
}
function sendMessage(node, message) {
    const buffer = Buffer.from(JSON.stringify(message));
    server.send(buffer, node.port, node.host);
}
function startNodeAction() {
    const randomNumber = Math.floor(Math.random() * 11);
    const allNodesExceptMe = [];
    allNodes.map(node => {
        if (node.id != nodeData.id) {
            allNodesExceptMe.push(node);
        }
    });
    const randomNode = Utils_1.shuffle(allNodesExceptMe.map(node => node.id))[0];
    const chosenNode = allNodes.find(node => node.id === randomNode);
    if (randomNumber >= nodeData.chance * 10) {
        localLamportClock.count++;
        const objectOfLocalMessage = {
            status: 'local',
            m: Date.now(),
            i: nodeData.id,
            c: `${localLamportClock.count}${nodeData.id}`
        };
        const message = `${objectOfLocalMessage.m} ${objectOfLocalMessage.i} ${objectOfLocalMessage.c} l \n`;
        console.log(message);
        fs_1.default.writeFile(`output_${nodeData.id}`, message, { flag: 'a' }, function (err) {
            if (err)
                throw err;
        });
    }
    else {
        const objectOfMessage = {
            status: 'send',
            m: Date.now(),
            i: nodeData.id,
            c: `${localLamportClock.count}${nodeData.id}`,
            d: chosenNode.id
        };
        const message = `${objectOfMessage.m} ${objectOfMessage.i} ${objectOfMessage.c} s ${objectOfMessage.d}\n`;
        console.log(message);
        fs_1.default.writeFile(`output_${nodeData.id}`, message, { flag: 'a' }, function (err) {
            if (err)
                throw err;
        });
        const jsonStringfied = JSON.stringify(objectOfMessage);
        server.send(Buffer.from(jsonStringfied), chosenNode.port, chosenNode.host, (error) => {
            if (error) {
                console.log(`Erro ao enviar mensagem para o nodo ${chosenNode.id}.`);
                throw error;
            }
        });
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//# sourceMappingURL=app.js.map