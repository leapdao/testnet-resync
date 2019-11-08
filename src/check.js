require('dotenv').config();

const fs = require('fs');
const { execSync } = require('child_process');
const slackAlert = require('./slackAlert');

// shortcut, do nothing if no pid file
// pid file is created on start (daily) and deleted once
// we process the result (either success or failure)
if (!fs.existsSync('./node.pid') || !fs.existsSync('./node.log')) {
  return;
}

const stopNode = () => {
  try {
    process.kill(Number(fs.readFileSync('node.pid')))
    fs.unlinkSync('node.pid');
  } catch (e) {
    console.warn(e);
  }
};

const { SLACK_HOOK_URL, SLACK_CHANNEL } = process.env;

// stop the node, if resync succeed. No notifications
const resyncSucceed = !!execSync(
  'grep "Http JSON RPC server is listening" node.log || echo ""'
).toString().trim();

if (resyncSucceed) {
  stopNode();
  return;
}

// if no logs produced for 5 minutes, stop the node and send an alert
const lastTimeUpdated = fs.statSync('node.log').mtime;
const minutesSinceLastUpdate = (Date.now() - lastTimeUpdated.getTime()) / 1000 / 60;

if ( minutesSinceLastUpdate > 5) {
  stopNode();
  const logTail = execSync('tail -n 10 node.log').toString().trim();
  slackAlert(SLACK_HOOK_URL, SLACK_CHANNEL, 'failed\n\n' + '```\n' + logTail + '\n```');
}