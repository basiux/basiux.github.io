function loadGameStateCallback (filedata) {
  pool.gameState = filedata;
}

function loadGameState () {
  self.nes.cpu.mem = pool.gameState;
}

function saveGameState () {
  saveIndexedDB('gameState', self.nes.cpu.mem);
  loadIndexedDB('gameState', loadGameStateCallback);
}

function getPositions () {
          marioX = self.nes.cpu.mem[0x6D]*0x100 + self.nes.cpu.mem[0x86];
          marioY = self.nes.cpu.mem[0x03B8] + 16;
}

function getTile (dx, dy) {
          var x = marioX + dx + 8;
          var y = marioY + dy - 16;
          var page = Math.floor(x/256)%2;

          var subx = Math.floor((x%256)/16);
          var suby = Math.floor((y - 32)/16);
          var addr = 0x500 + page*13*16+suby*16+subx;

          if (suby >= 13 || suby < 0) {
                  return 0;
          }

          if (self.nes.cpu.mem[addr] !== 0) {
                  return 1;
          } else {
                  return 0;
          }
}

function getSprites () {
        var sprites = [];
        for (var slot=0; slot<=4; slot++) {
                var enemy = self.nes.cpu.mem[0xF+slot];
                if (enemy !== 0) {
                        var ex = self.nes.cpu.mem[0x6E+slot]*0x100 + self.nes.cpu.mem[0x87+slot];
                        var ey = self.nes.cpu.mem[0xCF+slot] + 24;
                        sprites.push( {"x":ex,"y":ey} );
                }
        }

        return sprites;
}

function getInputs () {
        getPositions();

        var sprites = getSprites();

        var inputs = [];

        for (var dy=-BoxRadius*16; dy<=BoxRadius*16; dy+=16) {
                for (var dx=-BoxRadius*16; dx<=BoxRadius*16; dx+=16) {
                        inputs[inputs.length+0] = 0; // array bonds

                        tile = getTile(dx, dy);
                        if (tile == 1 && marioY+dy < 0x1B0) {
                                inputs[inputs.length-1] = 1; // array bonds
                        }

                        for (var i = 0; i<sprites.length; i++) { // array bonds
                                distx = Math.abs(sprites[i]["x"] - (marioX+dx));
                                disty = Math.abs(sprites[i]["y"] - (marioY+dy));
                                if (distx <= 8 && disty <= 8) {
                                        inputs[inputs.length-1] = -1; // array bonds
                                }
                        }
                }
        }

        //mariovx = memory.read_s8(0x7B)
        //mariovy = memory.read_s8(0x7D)

        return inputs;
}

// figured out a few mario memory things below on google, then thealmightyguru.com

function getTime () {
  var time = self.nes.cpu.mem[0x7F8] * 100;
  time += self.nes.cpu.mem[0x7F9] * 10;
  time += self.nes.cpu.mem[0x7FA];
  return time;
}

function getPlayerLives () {
  return self.nes.cpu.mem[0x75A];
}

function isPlayerObjPause () {
  return (self.nes.cpu.mem[0x747] > 0);
}

function isPlayerPlaying () {
  return (self.nes.cpu.mem[0x770] == 1);
}

function isMarioReady (gameTime) {
  return isPlayerPlaying() && !isPlayerObjPause() && gameTime < 401;
}
