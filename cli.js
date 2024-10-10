const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');

console.log('starting request');

async function handler(action, options){
    //console.log(arguments);
    console.log('action = ')
    console.log(action)
    console.log('options = ')
    console.log(options)
}
program.argument('<action>').requiredOption('-l, --prefix-length <prefix_length>', 'the length of the prefix for node lookup')
	.requiredOption('-k, --completion-size <completion_size>', 'the number of completions to be stored for a given prefix')
	.requiredOption('-c, --category <category>', 'The acronym used for prepending the prefix')
	.requiredOption('-s, --source <source...>', 'the source of the corpus to be pulled in to parse')
    .option('-d','--dry-run','run with out saving, will be saved locally')
    .action(handler)
    
program.parse(process.argv);





