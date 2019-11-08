require('dotenv').config();

const fs = require('fs');
const { spawn } = require('child_process');

// get fresh leap-node
process.chdir('leap-node');
spawn('git', ['pull'], { stdio: 'inherit' });
spawn('yarn', [], { stdio: 'inherit' });

const { ROOT_NETWORK_URL } = process.env;
const nodeExec = 
  `index.js --config=../leap-testnet.json --rootNetwork=${ROOT_NETWORK_URL}`;


// clean leap-node data, so we do full resync
spawn('node', [...nodeExec.split(' '), '--fresh']);

const out = fs.openSync('../node.log', 'a');
const err = fs.openSync('../node.log', 'a');

// start resync
const proc = spawn(
  'node', 
  nodeExec.split(' '),
  { detached: true, stdio: ['ignore', out, err] }
);
proc.unref();
fs.writeFileSync('../node.pid', proc.pid);