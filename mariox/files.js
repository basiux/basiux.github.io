function openIndexedDB () {
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  var openDB = indexedDB.open("marioxDB", 1);

  openDB.onupgradeneeded = function() {
    var db = openDB.result;
    var store = db.createObjectStore("marioxOBJ", {keyPath: "id"});
    //var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
  };

  return openDB;
}

function getStoreIndexedDB (openDB) {
  var db = openDB.result;
  var tx = db.transaction("marioxOBJ", "readwrite");
  var store = tx.objectStore("marioxOBJ");
  //var index = store.index("NameIndex");

  return store;
}

function saveIndexedDB (filename, filedata) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var store = getStoreIndexedDB(openDB);

    store.put({id: filename, data: filedata});
  }
}

function loadIndexedDB (filename, callback) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = openDB.result;
    var tx = db.transaction("marioxOBJ", "readwrite");
    var store = tx.objectStore("marioxOBJ");

    var getData = store.get(filename);

    getData.onsuccess = function() {
      callback(getData.result.data);
    };

    tx.oncomplete = function() {
      db.close();
    };
  }
}

function writeFile (filename) { // using indexedDB for the win! :)
        // `poolContent` rather than `pool` for strict lua adaptation
        var poolContent = [];
        poolContent.push(pool.generation);
        poolContent.push(pool.maxFitness);
        poolContent.push(pool.species);
        saveIndexedDB(filename, poolContent);
        //var fileSize = poolContent; // just for log
        //console.log('writing file '+ filename);// +' - pool size: '+ fileSize);
        //setTimeout(function(){
          //var content = JSON.stringify(poolContent);
          //var compressed = LZString.compressToUTF16(content); // review - very, very slow bottleneck
          //console.log('writing file '+ filename +' - pool size: '+ content.length +' compressed: '+ compressed.length);
          //localStorage.setItem(filename, compressed);
        //},0);
}

function savePool () {
        var filename = $form.find('input#saveLoadFile').val();
        writeFile(filename);
}

function loadFile (filename) {
        //var compressed = localStorage.getItem(filename);
        //var content = LZString.decompressFromUTF16(compressed);
        //var poolContent = jQuery.parseJSON(content);
        //console.log('loading '+ filename +' - pool size: '+ content.length +' compressed: '+ compressed.length);
        loadIndexedDB(filename, loadFileCallback);
        //var content = JSON.stringify(poolContent); // just for log
        //console.log('loading '+ filename);// +' - pool size: '+ content.length);
}
function loadFileCallback (poolContent) {
        pool.species = poolContent.pop();
        pool.maxFitness = poolContent.pop();
        pool.generation = poolContent.pop();

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
