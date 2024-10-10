const Promise = require("bluebird");
const Memcached = require('memcached');
const CreateAction = require('./actions/create')
/**
 * var memcached = new Memcached({ '192.168.0.102:11211': 1, '192.168.0.103:11211': 2, '192.168.0.104:11211': 1 });
 * var memcached = new Memcached([ '192.168.0.102:11211', '192.168.0.103:11211', '192.168.0.104:11211' ]);
 * var memcached = new Memcached('192.168.0.102:11211');
 */

// all global configurations should be applied to the .config object of the Client.
//memcached.config.poolSize = 25;
async function create(memcached) {
    console.log('creating index')
    const data = await CreateAction.start()
    const keys = data.getKeys();
    for (key of keys) {
        const suggestions = data.get(key);
        memcached.set(key, suggestions, 0, function (err) {
            console.log(err);
        });
    }
}

async function query(memcached) {
    console.log('querying data');
    memcached.get('en:pC~G', function (err, data) {
        console.log('return from get request');
        if (data) console.log(data);
        if (err) console.log(err);
        process.exit(1);
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    const locations = ['169.48.223.150:30000', '169.63.44.70:30001', '169.48.223.153:30002'];
    const options = {}; // https://www.npmjs.com/package/memcached#options
    const memcached = new Memcached(locations);
    console.log(memcached)
    memcached.debug = true;
    //await create(memcached);
    //await sleep(120000);
    await query(memcached);
})();