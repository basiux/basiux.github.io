function displayGenome (genome) { // review - at least the `gui.`
        var network = genome.network;
        var cells = [];
        var i = 0; // array bonds
        var cell = {};
        for (var dy=-BoxRadius; dy<BoxRadius; dy++) {
                for (var dx=-BoxRadius; dx<BoxRadius; dx++) {
                        cell = {};
                        cell.x = 50+5*dx;
                        cell.y = 70+5*dy;
                        cell.value = network.neurons[i].value;
                        cells[i] = cell;
                        i = i + 1;
                }
        }
        var biasCell = {};
        biasCell.x = 80;
        biasCell.y = 110;
        biasCell.value = network.neurons[Inputs-1].value; // array bonds
        cells[Inputs] = biasCell;

        for (var o = 0; o<Outputs; o++) {
                cell = {};
                cell.x = 220;
                cell.y = 30 + 8 * o;
                cell.value = network.neurons[MaxNodes + o].value;
                cells[MaxNodes+o] = cell;
                var color;
                if (cell.value > 0) {
                        color = 0xFF0000FF;
                } else {
                        color = 0xFF000000;
                }
                $aigui.find('#show #buttonNames').html( ButtonNames[o] +'<br>' );
                //gui.drawText(223, 24+8*o, ButtonNames[o], color, 9);
        }

        for (var n in network.neurons) { // in pairs
                var neuron = network.neurons[n];
                cell = {};
                if (n >= Inputs && n <= MaxNodes) {
                        cell.x = 140;
                        cell.y = 40;
                        cell.value = neuron.value;
                        cells[n] = cell;
                }
        }

        for (var n=0; n<4; n++) {
                for (var _ in genome.genes) { // in pairs
                        var gene = genome.genes[_];
                        if (gene.enabled) {
                                var c1 = cells[gene.into];
                                var c2 = cells[gene.out];
                                if (gene.into > Inputs && gene.into <= MaxNodes) { // array bonds
                                        c1.x = 0.75*c1.x + 0.25*c2.x;
                                        if (c1.x >= c2.x) {
                                                c1.x = c1.x - 40;
                                        }
                                        if (c1.x < 90) {
                                                c1.x = 90;
                                        }

                                        if (c1.x > 220) {
                                                c1.x = 220;
                                        }
                                        c1.y = 0.75*c1.y + 0.25*c2.y;

                                }
                                if (gene.out >= Inputs && gene.out <= MaxNodes) {
                                        c2.x = 0.25*c1.x + 0.75*c2.x;
                                        if (c1.x >= c2.x) {
                                                c2.x = c2.x + 40;
                                        }
                                        if (c2.x < 90) {
                                                c2.x = 90;
                                        }
                                        if (c2.x > 220) {
                                                c2.x = 220;
                                        }
                                        c2.y = 0.25*c1.y + 0.75*c2.y;
                                }
                        }
                }
        }

        // gui.drawBox(50-BoxRadius*5-3,70-BoxRadius*5-3,50+BoxRadius*5+2,70+BoxRadius*5+2,0xFF000000, 0x80808080);
        for (var n in cells) { // in pairs
                var cell = cells[n];
                if (n >= Inputs || cell.value != 0) {
                        var color = Math.floor((cell.value+1)/2*256);
                        if (color > 255) { color = 255 };
                        if (color < 0) { color = 0 };
                        var opacity = 0xFF000000;
                        if (cell.value == 0) {
                                opacity = 0x50000000;
                        }
                        color = opacity + color*0x10000 + color*0x100 + color;
                        // gui.drawBox(cell.x-2,cell.y-2,cell.x+2,cell.y+2,opacity,color);
                }
        }
        for (var _ in genome.genes) { // in pairs
                var gene = genome.genes[_];
                if (gene.enabled) {
                        var c1 = cells[gene.into];
                        var c2 = cells[gene.out];
                        var opacity = 0xA0000000;
                        if (c1.value == 0) {
                                opacity = 0x20000000;
                        }

                        var color = 0x80-Math.floor(Math.abs(sigmoid(gene.weight))*0x80);
                        if (gene.weight > 0) {
                                color = opacity + 0x8000 + 0x10000*color;
                        } else {
                                color = opacity + 0x800000 + 0x100*color;
                        }
                        // gui.drawLine(c1.x+1, c1.y, c2.x-3, c2.y, color);
                }
        }

        // gui.drawBox(49,71,51,78,0x00000000,0x80FF0000);

        if ($form.find('input#showMutationRates')[0].checked) {
                var pos = 100;
                for (var mutation in genome.mutationRates) { // in pairs
                        var rate = genome.mutationRates[mutation];
                        $aigui.find('#show #mutation').html( mutation +': '+ rate +'<br>' );
                        //gui.drawText(100, pos, mutation + ": " + rate, 0xFF000000, 10);
                        pos = pos + 8;
                }
        }
}

function displayBanner () {
  $aigui.find('div#banner').toggle(!$form.find('input#hideBanner')[0].checked);
}

function limitFPS () {
  if ($form.find('input#limitFPS')[0].checked) {
    fpsinterval = self.nes.frameTime;
  } else {
    fpsinterval = 0;
  }
  clearInterval(mainLoopInterval);
  mainLoopInterval = setInterval(asyncMainLoop, fpsinterval);
}

function createAiGUI () {
  $aigui = $('<div id="aigui"></div>').appendTo('#emulator');

  var $banner = $('<div id="banner" style="background: 0xD0FFFFFF"></div>').appendTo($aigui);
  $banner.append('<label for="gen">Gen <span id="gen" class="data"></span></label>');
  $banner.append('<label for="fitness">Fitness: <span id="fitness" class="data"></span></label>');
  $banner.append('<label for="maxFitness">Max Fitness: <span id="maxFitness" class="data"></span></label>');

  var $show = $('<div id="show"></div>').appendTo($aigui);
  $show.append('<span id="buttonNames" class="data"></span>');
  $show.append('<span id="mutations" class="data"></span>');

  $form = $('<form id="fitnessSettings"><h1>Fitness Settings</h1></form>').appendTo('#emulator');

  $form.append('<label for="maxFitness">Max Fitness: <input id="maxFitness" type="text" value="'+ Math.floor(pool.maxFitness) +'"></label>');
  $form.append('<label for="showNetwork"><input checked id="showNetwork" type="checkbox"> Show Map</label>');
  $form.append('<label for="showMutationRates"><input checked id="showMutationRates" type="checkbox"> Show M-Rates</label>');
  $form.append( $('<input id="restartButton" type="button" value="Restart">').click(initializePool) );
  $form.append( $('<input disabled id="saveButton" type="button" value="Save">').click(savePool) );
  $form.append( $('<input disabled id="loadButton" type="button" value="Load">').click(loadPool) );
  $form.append('<label for="saveLoadFile">Save/Load: <input id="saveLoadFile" type="text" value="'+ Filename +'.pool"></label>');
  $form.append( $('<input id="playTopButton" type="button" value="Play Top">').click(playTop) );
  $form.append( $('<label for="hideBanner"><input id="hideBanner" type="checkbox"> Hide Banner</label>').click(displayBanner) );
  $form.append( $('<label for="limitFPS"><input id="limitFPS" type="checkbox"> Limit FPS</label>').click(limitFPS) );
}
