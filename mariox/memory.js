// review - probably need to adapt a lot of things here

function getPositions () {/*
          marioX = memory.read_s16_le(0x94);
          marioY = memory.read_s16_le(0x96);

          var layer1x = memory.read_s16_le(0x1A);
          var layer1y = memory.read_s16_le(0x1C);

          screenX = marioX-layer1x;
          screenY = marioY-layer1y;
/*        } else if ( gameinfo.getromname() == "Super Mario Bros." ) {
                marioX = memory.readbyte(0x6D) * 0x100 + memory.readbyte(0x86);
                marioY = memory.readbyte(0x03B8)+16;

                screenX = memory.readbyte(0x03AD);
                screenY = memory.readbyte(0x03B8);
        }
*/}

function getTile (dx, dy) {/*
        if gameinfo.getromname() == "Super Mario World (USA)" {
                x = math.floor((marioX+dx+8)/16)
                y = math.floor((marioY+dy)/16)

                return memory.readbyte(0x1C800 + math.floor(x/0x10)*0x1B0 + y*0x10 + x%0x10)
        elseif gameinfo.getromname() == "Super Mario Bros." {
                var x = marioX + dx + 8
                var y = marioY + dy - 16
                var page = math.floor(x/256)%2

                var subx = math.floor((x%256)/16)
                var suby = math.floor((y - 32)/16)
                var addr = 0x500 + page*13*16+suby*16+subx

                if suby >= 13 or suby < 0 {
                        return 0
                }

                if memory.readbyte(addr) ~= 0 {
                        return 1
                else
                        return 0
                }
        }
*/}

function getSprites () {/*
        if gameinfo.getromname() == "Super Mario World (USA)" {
                var sprites = {}
                for slot=0,11 {
                        var status = memory.readbyte(0x14C8+slot)
                        if status ~= 0 {
                                spritex = memory.readbyte(0xE4+slot) + memory.readbyte(0x14E0+slot)*256
                                spritey = memory.readbyte(0xD8+slot) + memory.readbyte(0x14D4+slot)*256
                                sprites[#sprites+1] = {["x"]=spritex, ["y"]=spritey}
                        }
                }

                return sprites
        elseif gameinfo.getromname() == "Super Mario Bros." {
                var sprites = {}
                for slot=0,4 {
                        var enemy = memory.readbyte(0xF+slot)
                        if enemy ~= 0 {
                                var ex = memory.readbyte(0x6E + slot)*0x100 + memory.readbyte(0x87+slot)
                                var ey = memory.readbyte(0xCF + slot)+24
                                sprites[#sprites+1] = {["x"]=ex,["y"]=ey}
                        }
                }

                return sprites
        }
*/}

function getExtedSprites () {/*
        if gameinfo.getromname() == "Super Mario World (USA)" {
                var ext}ed = {}
                for slot=0,11 {
                        var number = memory.readbyte(0x170B+slot)
                        if number ~= 0 {
                                spritex = memory.readbyte(0x171F+slot) + memory.readbyte(0x1733+slot)*256
                                spritey = memory.readbyte(0x1715+slot) + memory.readbyte(0x1729+slot)*256
                                ext}ed[#ext}ed+1] = {["x"]=spritex, ["y"]=spritey}
                        }
                }

                return ext}ed
        elseif gameinfo.getromname() == "Super Mario Bros." {
                return {}
        }
*/}

function getInputs () {/*
        getPositions();

        sprites = getSprites();
        ext}ed = getExt}edSprites();

        var inputs = {};

        for dy=-BoxRadius*16,BoxRadius*16,16 {
                for dx=-BoxRadius*16,BoxRadius*16,16 {
                        inputs[#inputs+1] = 0

                        tile = getTile(dx, dy)
                        if tile == 1 and marioY+dy < 0x1B0 {
                                inputs[#inputs] = 1
                        }

                        for i = 1,#sprites {
                                distx = math.abs(sprites[i]["x"] - (marioX+dx))
                                disty = math.abs(sprites[i]["y"] - (marioY+dy))
                                if distx <= 8 and disty <= 8 {
                                        inputs[#inputs] = -1
                                }
                        }

                        for i = 1,#ext}ed {
                                distx = math.abs(ext}ed[i]["x"] - (marioX+dx))
                                disty = math.abs(ext}ed[i]["y"] - (marioY+dy))
                                if distx < 8 and disty < 8 {
                                        inputs[#inputs] = -1
                                }
                        }
                }
        }

        //mariovx = memory.read_s8(0x7B)
        //mariovy = memory.read_s8(0x7D)

        return inputs;
*/}
