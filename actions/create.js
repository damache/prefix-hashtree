require("google-closure-library");
const HashTree = require('../lib/hashtree');
goog.require("goog.structs.PriorityQueue");
const fs = require('fs');
const path = require('path');

const start = async (l = 5, c = 'en:pC', k=50)  =>{
    const jsonFile = path.join(__dirname + '/../data/sales_cloud.json');
    const phtFile = path.join(__dirname + '/../data/prefix-hash-tree.json');
    const data = JSON.parse(fs.readFileSync(jsonFile)).data;
    const htPriorityQueue = new HashTree();
    //read in data must have a priority and text.

    //HT<prefix, PQ>
    //1. build a hastable with the possible prefixes of the words we want to. 
    //prefixes are bound by subcommand l.  
    //each prefix is prepended with the subcommand value c followed by ~

    //2. set the value of the hashtable key (prefix) a priority queue with the phrases
    //to suggest.  limit the number of values in the PQ using K subcommand value
    for (const d of data) {
        let i;
        const text = d.text;
        const words = text.split(" ");
        for (word of words) {
            const wordLength = word.length;
            for (i = 0; i < wordLength && l > i; i++) {
                const char = word.substring(0, i + 1);
                const prefix = `${c}~${char}`;
                if (htPriorityQueue.has(prefix)) {

                    const pq = htPriorityQueue.get(prefix)
                    if (!pq.containsValue(text))
                        pq.enqueue(d.priority, text)
                } else {
                    const PriorityQueue = new goog.structs.PriorityQueue();
                    PriorityQueue.enqueue(d.priority, text);
                    htPriorityQueue.set(prefix, PriorityQueue);
                }
            }
        }
    }
    //console.log(JSON.stringify(htPriorityQueue, null, 2))
    //3. convert the HT<prefix, PQ> -> HT<prefix, Array>
    const keys = htPriorityQueue.getKeys();
    console.log(keys);
    const htArray = new HashTree(keys.length, 100)
    for (key of keys) {
        const values = htPriorityQueue.get(key).getValues();
        htArray.set(key, values.slice(0,k));
    }
    //4. serialize the prefix hash tree for use by memcached
    fs.writeFile(phtFile, JSON.stringify(htArray, null, 2), function (err) {
        if (err) return console.log(err);
    });

    return htArray;
}

module.exports.start = start;