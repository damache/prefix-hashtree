Base algorithm: O(L) + O(N) + O(K log K)  

N: total number of nodes in tree  
prefix: what a user has typed so far.  should be constrained by length to evaluate (l)
completions: all possible ways a given prefix can be completed in order to form a word or phrase  (k)  
suggestions: the top ranked completions which will be presented to the user   
score: an integer representing the popularity of a given completion  
selection: the suggestion that the user chooses or a new completion that the user submits  

to help with time complexity of the alogithm, we can remove O(N) by creating a node for each prefix along side all completions for that prefix.  For example we have a node with the prefix (key), "opp" and all completions that start with opp (values), such as "opportunity", "opportunities", "opposition", "opportunistic", etc

this will create duplicate entries for prefixes.  in the example of "opp", each work and more would be stored with "o" and "op".  memory is cheap so we will accept this tradeoff for performance.

Next we will limit O(l) by constraining the length of the prefixes that are stored.  for a completion of "show me my opportunities in design phase", creating a prefix for all characters would not be resonable.  Setting l to 5 (or something small) then parsing the completion of any non-stop words with the completion among the values.  

Finally, limiting K to storing only those completions based on high ranking suggestions.  Storing around 50 completions for a given prefix should give us enough accuracy. 

Final algorithm becomes O(1).  

The algorthm is implemented as a prefix hash tree, where every prefix is mapped to a hash key and map the prefix's completions to the hash value associated eith the key.  

The prefix will contain a categorization to help faciliate the completions that pertain to a specific corpus of data used for the suggestions.  These are:  
en:pC - English PRM Chatbot  
en:sC - English Support Chatbot  
en:sS - English Support Search

The categorization needs to be defined when parsing the source.  example for a query on "opp", the prefix will be "pC~opp".  