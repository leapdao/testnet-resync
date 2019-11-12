const fetch = require('node-fetch');

module.exports = (slackAlertUrl, slackChannel, text) => {
  if (!slackAlertUrl || !slackChannel) return Promise.reject('is not configured');

  const alertText = `🚨 *Testnet resync test*\n\n ${text}\n`;

  return new Promise((fulfill, reject) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        channel: slackChannel,
        username: 'testnet resync',
        text: alertText,
        icon_emoji: ':robot_face:',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return fetch(slackAlertUrl, options).then(res => fulfill(res), err => reject(JSON.stringify(err)));
  });
};
