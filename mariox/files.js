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
        var poolContent = [];
        poolContent.push(pool.duration);
        poolContent.push(pool.generation);
        poolContent.push(pool.maxFitness);
        poolContent.push(pool.species);
        saveIndexedDB(filename, poolContent);
        //var fileSize = JSON.stringify(poolContent).length; // couldn't figure out a fast way, just for log
        //console.log('writing file '+ filename);// +' - pool size: '+ fileSize);
}

function savePool () {
        var filename = $form.find('input#saveLoadFile').val();
        writeFile(filename);
}

function loadFile (filename) {
        loadIndexedDB(filename, loadFileCallback);
        //var fileSize = JSON.stringify(poolContent).length; // couldn't figure out a fast way, just for log
        //console.log('loading '+ filename);// +' - pool size: '+ fileSize);
}
function loadFileCallback (poolContent) {
        pool.species = poolContent.pop();
        pool.maxFitness = poolContent.pop();
        pool.generation = poolContent.pop();
        pool.duration = poolContent.pop();

        $form.find('input#maxFitness').val(Math.floor(pool.maxFitness));

        while ( fitnessAlreadyMeasured() ) {
                nextGenome();
        }
        initializeRun();
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
