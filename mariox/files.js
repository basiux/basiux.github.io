function writeFile (filename) { // actually using compressed localstorage instead of files
        var poolContent = [];
        poolContent.push(pool.generation);
        poolContent.push(pool.maxFitness);
        poolContent.push(pool.species);
        var unzipped = new jsonZipper(poolContent); // might use just `pool` rather than poolContent
        var zipped = unzipped.zip();
        var content = JSON.stringify(zipped);
        var uncompressedContent = JSON.stringify(poolContent); // just for log
        console.log('writing file '+ filename +' - pool size: '+ uncompressedContent.length +' compressed: '+ content.length);
        localStorage.setItem(filename, content);
}

function savePool () {
        var filename = $form.find('input#saveLoadFile').val();
        writeFile(filename);
}

function loadFile (filename) {
        var content = localStorage.getItem(filename);
        var parsed = jQuery.parseJSON(content);
        var zipped = new jsonZipper(parsed, true);
        var poolContent = zipped.unzip(); // unzipped
        var uncompressedContent = JSON.stringify(poolContent); // just for log (and size check)
        console.log('loading '+ filename +' - pool size: '+ uncompressedContent.length +' compressed: '+ content.length);
        pool.species = poolContent.pop();
        pool.maxFitness = poolContent.pop();
        pool.generation = poolContent.pop();

        $form.find('input#maxFitness').val(Math.floor(pool.maxFitness));

        while ( fitnessAlreadyMeasured() ) {
                nextGenome();
        }
        initializeRun();
        pool.currentFrame = pool.currentFrame + 1;
}

function loadPool () {
        var filename = $form.find('input#saveLoadFile').val();
        loadFile(filename);
}
