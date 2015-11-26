//var JJLCdict = {"\"into\":":"£a£","\"out\":":"£b£","\"weight\":":"£c£","\"enabled\":":"£d£","\"innovation\":":"£e£","\"topFitness\":":"£f£","\"genes\":":"£g£","\"averageFitness\":":"£h£","\"genomes\":":"£i£","\"fitness\":":"£j£","\"adjustedFitness\":":"£k£","\"network\":":"£l£","\"step\":":"£m£","\"staleness\":":"£n£","\"disable\":":"£o£","\"maxneuron\":":"£p£","\"globalRank\":":"£q£","\"mutationRates\":":"£r£","\"connections\":":"£s£","\"link\":":"£t£","\"bias\":":"£u£","\"node\":":"£v£","\"enable\":":"£w£","\"value\":":"£x£","\"incoming\":":"£y£","\"neurons\":":"£z£"};

function writeFile (filename) { // actually using compressed localstorage instead of files
        var poolContent = [];
        poolContent.push(pool.generation);
        poolContent.push(pool.maxFitness);
        poolContent.push(pool.species);
        var content = JSON.stringify(poolContent); // might use just `pool` rather than poolContent
        //localStorage.setItem(filename, content);
        //JJLC.setDict(filename, JJLCdict, 'no-localstorage');
        var compressed = JJLC.setItem(filename, content);//, 'local-dict'); // compress and throw it on localStorage
        //console.log(pool +' pool size: '+ content.length +' compressed: '+ compressed.length);
        // var dict = JSON.stringify(JJLC.getDict(filename)); console.log(dict); // generate JJLCdict
}

function savePool () {
        var filename = forms.gettext(saveLoadFile);
        writeFile(filename);
}

function loadFile (filename) {
        //var json = localStorage.getItem(filename);
        var json = JJLC.getItem(filename); // decompress from localStorage
        parsedContent = jQuery.parseJSON(json); // might use straight `pool` rather than parsedContent
        pool.species = parsedContent.pop();
        pool.maxFitness = parsedContent.pop();
        pool.generation = parsedContent.pop();

        //forms.settext(maxFitnessLabel, "Max Fitness: " .. math.floor(pool.maxFitness))

        while ( fitnessAlreadyMeasured() ) {
                nextGenome();
        }
        initializeRun();
        pool.currentFrame = pool.currentFrame + 1;
}

function loadPool () {
        var filename = forms.gettext(saveLoadFile);
        loadFile(filename);
}
