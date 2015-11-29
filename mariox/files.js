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

function writeFile (filename) { // using indexedDB for the win! :)
        // `poolContent` rather than `pool` for strict lua adaptation
        var poolContent = {};
        poolContent.duration = [].push(pool.duration);
        poolContent.generation = [].push(pool.generation);
        poolContent.maxFitness = [].push(pool.maxFitness);
        poolContent.species = [].push(pool.species);
        //poolContent.gameState = [].push(pool.gameState);
        saveIndexedDB(filename, poolContent);
        pool.state = [].push(poolContent);
        //var fileSize = JSON.stringify(poolContent).length; // couldn't figure out a fast way, just for log
        //console.log('writing file '+ filename);// +' - pool size: '+ fileSize);
}

function savePool () {
        var filename = $form.find('input#saveLoadFile').val();
        writeFile(filename);
}

function grabPoolContent (name) {
  while (pool.state[name].length > 0) {
    pool[name] = pool.state[name].pop();
  }
}
function loadFile (filename) {
        loadIndexedDB(filename, loadFileCallback);
        //var fileSize = JSON.stringify(poolContent).length; // couldn't figure out a fast way, just for log
        //console.log('loading '+ filename);// +' - pool size: '+ fileSize);
}
function loadFileCallback (poolContent) {
        if ( poolContent.length == 4 || ( poolContent.length == 5 && isEmpty(poolContent[4]) ) ) {
          if (poolContent.length == 5) poolContent.pop();
          pool.species = poolContent.pop();
          pool.maxFitness = poolContent.pop();
          pool.generation = poolContent.pop();
          pool.duration = poolContent.pop();
        } else {
          pool.state = poolContent;
          //grabPoolContent('gameState');
          grabPoolContent('species');
          grabPoolContent('maxFitness');
          grabPoolContent('generation');
          grabPoolContent('duration');
          pool.state = [].push(poolContent);
        }

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

function restartPool () {
  savePool();
  initializePool();
}
