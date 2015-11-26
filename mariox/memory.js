// review - probably need to adapt a lot of things here

function getPositions () {
          marioX = 0;//memory.readbyte(0x6D) * 0x100 + memory.readbyte(0x86);
          marioY = 0;//memory.readbyte(0x03B8)+16;

          screenX = 0;//memory.readbyte(0x03AD);
          screenY = 0;//memory.readbyte(0x03B8);
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

          if (false) {// (memory.readbyte(addr) != 0) {
                  return 1;
          } else {
                  return 0;
          }
}

function getSprites () {
        var sprites = {};
        for (var slot=0; slot<=4; slot++) {
                var enemy = 0;//memory.readbyte(0xF+slot);
                if (enemy != 0) {
                        var ex = 0;//memory.readbyte(0x6E + slot)*0x100 + memory.readbyte(0x87+slot)
                        var ey = 0;//memory.readbyte(0xCF + slot)+24
                        sprites.push({"x":ex,"y":ey});//sprites[sprites.length+1] = {"x":ex,"y":ey};
                }
        }

        return sprites;
}

function getInputs () {
        getPositions();

        sprites = getSprites();

        var inputs = {};

        for (dy=-BoxRadius*16; dy<=BoxRadius*16; dy+=16) {
                for (dx=-BoxRadius*16; dx<=BoxRadius*16; dx+=16) {
                        inputs[inputs.length+1] = 0;

                        tile = getTile(dx, dy);
                        if (tile == 1 && marioY+dy < 0x1B0) {
                                inputs[inputs.length] = 1;
                        }

                        for (i = 0; i<sprites.length; i++) { // review 1 or 0
                                distx = Math.abs(sprites[i]["x"] - (marioX+dx));
                                disty = Math.abs(sprites[i]["y"] - (marioY+dy));
                                if (distx <= 8 && disty <= 8) {
                                        inputs[inputs.length] = -1;
                                }
                        }
                }
        }

        //mariovx = memory.read_s8(0x7B)
        //mariovy = memory.read_s8(0x7D)

        return inputs;
}
