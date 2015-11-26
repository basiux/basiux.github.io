function writeFile (filename) { // actually using compressed localstorage instead of files
        var poolContent = [];
        poolContent.push(pool.generation);
        poolContent.push(pool.maxFitness);
        poolContent.push(pool.species);
        var content = JSON.stringify(poolContent); // might use just `pool` rather than poolContent
        //localStorage.setItem(filename, content);
        var compressed = JJLC.setItem(filename, content); // compress and throw it on localStorage
        console.log(pool +' pool size: '+ content.length +' compressed: '+ compressed.length);
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
