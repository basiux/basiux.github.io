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

function getStoreIndexedDB (openDB) {
  var db = {};
  db.result = openDB.result;
  db.tx = db.result.transaction("marioxOBJ", "readwrite");
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

function savePoolArea () {
  var poolContent = writeFile( autobackupFilename() +".poolArea."+ $form.find('input#saveLoadFile').val() );
  var poolStateArea = JSON.stringify(poolContent); // freaking slow, throws Uncaught RangeError: Invalid string length
  console.log('stringified '+ poolContent.length +'bytes of pool file')
  $poolStateArea.val(poolStateArea);
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
