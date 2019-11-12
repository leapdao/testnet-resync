
# Leap testnet resyncing scripts

We want to be sure that the latest leap-node is backward compatible with existing networks. For that we can run a full sync with the testnet. These scripts allow to automate that.

## Quick start

To be executed on a separate machine / VPS.

```sh
git clone https://github.com/leapdao/testnet-resync.git
cd testnet-resync

cp .env.template .env
# ACTION REQUIRED: update .env file with your Slack and root network details

yarn
curl -O https://raw.githubusercontent.com/leapdao/leap-node/master/presets/leap-testnet.json

git clone https://github.com/leapdao/leap-node --depth 1

# Run resync every night at 3 AM
(crontab -l 2>/dev/null; echo "0 3 * * * cd /home/ubuntu/testnet-resync/ && node src/resync.js >resync.log 2>resync.log") | crontab -

# Check the status every 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * cd /home/ubuntu/testnet-resync/ && node src/check.js >check.log 2>check.log") | crontab -
```
