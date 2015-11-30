function addSaveFileLink (filename) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB, "readonly");

    var getAll = [];

    $poolStateLink.text('generating . . . please wait');
    var req = db.store.openCursor();
    req.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        getAll.push(cursor.value);
        cursor.continue();
      } else {
        var url = window.URL.createObjectURL(
          new Blob(getAll, {'type': 'application/octet-stream'})
        );
        $poolStateLink.attr('href', url);
        $poolStateLink.text('download '+ filename +'.marioxPoolState');
        $poolStateLink.trigger('click');
      }
    };
    req.onerror = function () {
      $poolStateLink.text('error. please try again.'); // review - remember to add js notification
      console.error('error generating download file', this.error);
    }
  }
}

// indexedDB code all based on https://gist.github.com/BigstickCarpet/a0d6389a5d0e3a24814b

function openIndexedDB () {
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  var openDB = indexedDB.open("marioxDB", 1);

  openDB.onupgradeneeded = function() {
    var db = {}
    db.result = openDB.result;
    db.store = db.result.createObjectStore("marioxOBJ", {keyPath: "id"});
    //db.index = db.store.createIndex("NameIndex", ["name.last", "name.first"]);
  };

  return openDB;
}

function getStoreIndexedDB (openDB, mode) {
  if (!mode) mode = "readwrite";
  var db = {};
  db.result = openDB.result;
  db.tx = db.result.transaction("marioxOBJ", mode);
  db.store = db.tx.objectStore("marioxOBJ");
  //db.index = db.store.index("NameIndex");

  return db;
}

function saveIndexedDB (filename, filedata) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB);

    db.store.put({id: filename, data: filedata});
  }
}

function loadIndexedDB (filename, callback) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB);

    var getData = db.store.get(filename);
    getData.onsuccess = function() {
      callback(getData.result.data);
    };

    db.tx.oncomplete = function() {
      db.result.close();
    };
  }
}

function autobackupFilename () {
  return "autobackup"; // will probably need to add a timestamp for file list
}

function roughSizeOfObject( value, level ) {
    // awesome piece of code from Liangliang Zheng http://stackoverflow.com/a/6367736/274502
    // but still probably giving way far off object size for our usage case here

    if(level == undefined) level = 0;
    var bytes = 0;

    if ( typeof value === 'boolean' ) {
        bytes = 4;
    }
    else if ( typeof value === 'string' ) {
        bytes = value.length * 2;
    }
    else if ( typeof value === 'number' ) {
        bytes = 8;
    }
    else if ( typeof value === 'object' ) {
        if(value['__visited__']) return 0;
        value['__visited__'] = 1;
        for( i in value ) {
            bytes += i.length * 2;
            bytes+= 8; // an assumed existence overhead
            bytes+= roughSizeOfObject( value[i], 1 )
        }
    }

    if(level == 0){
        clear__visited__(value);
    }
    return bytes;
}

function clear__visited__(value){
    if(typeof value == 'object'){
        delete value['__visited__'];
        for(var i in value){
            clear__visited__(value[i]);
        }
    }
}

function writeFile (filename) { // using indexedDB for the win! :)
        // `poolContent` rather than `pool` for strict lua adaptation
        var poolContent = {};
        poolContent.duration = pool.duration;
        poolContent.generation = pool.generation;
        poolContent.maxFitness = pool.maxFitness;
        poolContent.species = pool.species;
        poolContent.gameState = pool.gameState;
        saveIndexedDB(filename, poolContent);
        pool.state = poolContent;
        //var fileSize = JSON.stringify(poolContent).length; // couldn't figure out a fast way, just for log
        console.log('writing file '+ filename);// +' - pool size: '+ fileSize);
        return poolContent;
}

function savePool () {
        var filename = $form.find('input#saveLoadFile').val();
        writeFile(filename);
}

function generateStateLink () {
  addSaveFileLink($form.find('input#saveLoadFile').val());
}

function savePoolArea () { // maybe this will still come back over download links
  //3rd attempt: var poolContent = writeFile( autobackupFilename() +".poolArea."+ $form.find('input#saveLoadFile').val() );
  //1st attempt: var poolStateArea = JSON.stringify(poolContent); // freaking slow, throws Uncaught RangeError: Invalid string length
  //var fileSize = roughSizeOfObject(poolContent);
  //2nd attempt: var fileSize = sizeof(poolContent); // much slower and apparently less precise than Zheng's
  //console.log('trying to stringify '+ fileSize +'bytes of pool file');
  //$poolStateArea.val('not implemented yet');//poolStateArea);
}

function grabPoolContent (name) { // leaving commented code to justify function, for now
  //while (pool.state[name].length > 0) {
    pool[name] = pool.state[name];//.pop()
  //}
}
function loadFile (filename) {
        loadIndexedDB(filename, loadFileCallback);
        //var fileSize = JSON.stringify(poolContent).length; // couldn't figure out a fast way, just for log
        //console.log('loading '+ filename);// +' - pool size: '+ fileSize);
}
function loadFileCallback (poolContent) {
        if ( poolContent.length == 4 || ( poolContent.length == 5 && isEmpty(poolContent[4]) ) ) {
          // legacy load for cregox's local machiine only (where old save were ever done)
          if (poolContent.length == 5) poolContent.pop();
          pool.species = poolContent.pop();
          pool.maxFitness = poolContent.pop();
          pool.generation = poolContent.pop();
          pool.duration = poolContent.pop();
          // don't need to worry about legacy, should delete this soon
        } else {
          pool.state = poolContent;
        }
        finishLoading();
}
function finishLoading () {
        grabPoolContent('gameState');
        grabPoolContent('species');
        grabPoolContent('maxFitness');
        grabPoolContent('generation');
        grabPoolContent('duration');

        pool.currentSpecies = 0;

        $form.find('input#maxFitness').val(Math.floor(pool.maxFitness));

        while ( fitnessAlreadyMeasured() ) {
                nextGenome();
        }
        initializeRun();
        //loadGameState();
        pool.currentFrame++;
}

function loadPool () {
        var filename = $form.find('input#saveLoadFile').val();
        loadFile(filename);
}

function loadPoolArea () {
  pool.state = $poolStateArea.val();
  finishLoading();
}

function restartPool () {
  writeFile( "autobackup.restart." + $form.find('input#saveLoadFile').val() );
  initializePool();
}
