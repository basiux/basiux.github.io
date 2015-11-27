function writeFile (filename) { // actually using compressed localstorage instead of files
        // using poolContent rather than `pool` for strict lua adaptation
        var poolContent = [];
        poolContent.push(pool.generation);
        poolContent.push(pool.maxFitness);
        poolContent.push(pool.species);
        var content = JSON.stringify(poolContent);
        var compressed = LZString.compressToUTF16(content); // review - very, very slow bottleneck
        //console.log('writing file '+ filename +' - pool size: '+ content.length +' compressed: '+ compressed.length);
        localStorage.setItem(filename, compressed);
}

function savePool () {
        var filename = $form.find('input#saveLoadFile').val();
        writeFile(filename);
}

function loadFile (filename) {
        var compressed = localStorage.getItem(filename);
        var content = LZString.decompressFromUTF16(compressed);
        var poolContent = jQuery.parseJSON(content);
        //console.log('loading '+ filename +' - pool size: '+ content.length +' compressed: '+ compressed.length);
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
