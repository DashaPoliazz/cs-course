[WARNING] virtual machine for some reason does not always build the script in the context correctly (couldn't figure out why). So we will have to run "node main.js" several times.

[DESCRIPTION] The goal of the project was to visually understand the flow of converting instructions in a fictional language into javascript. The converted javascript code knows how to perform simple stack operations (push, pop), and also knows how to work with functions (can only handle 2 arguments and perform one atomic operation so far). It's also possible to work with heap (only numbers could be stored on the heap).

Flow looks like the following:

Writing commands in bytecode.csff -> Parsing the bytecode.csff file -> Converting bytecode.csff to javascript -> Creating a script with execution context -> Executing the script

Translated with DeepL.com (free version).
