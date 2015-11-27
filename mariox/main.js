if ( isEmpty(pool) ) {
        initializePool();
}

// writeFile("temp.pool") // review - removed for testing, due to slow compression

//event.onexit(onExit) // review

createForm();

keepMaxFitnessUpdated(); // just in case

/*
while true do // review
        local backgroundColor = 0xD0FFFFFF
        if not forms.ischecked(hideBanner) then
                gui.drawBox(0, 0, 300, 26, backgroundColor, backgroundColor)
        end

        local species = pool.species[pool.currentSpecies]
        local genome = species.genomes[pool.currentGenome]

        if forms.ischecked(showNetwork) then
                displayGenome(genome)
        end

        if pool.currentFrame%5 == 0 then
                evaluateCurrent()
        end

        joypad.set(controller)

        getPositions()
        if marioX > rightmost then
                rightmost = marioX
                timeout = TimeoutConstant
        end

        timeout = timeout - 1


        local timeoutBonus = pool.currentFrame / 4
        if timeout + timeoutBonus <= 0 then
                local fitness = rightmost - pool.currentFrame / 2
                if gameinfo.getromname() == "Super Mario World (USA)" and rightmost > 4816 then
                        fitness = fitness + 1000
                end
                if gameinfo.getromname() == "Super Mario Bros." and rightmost > 3186 then
                        fitness = fitness + 1000
                end
                if fitness == 0 then
                        fitness = -1
                end
                genome.fitness = fitness

                if fitness > pool.maxFitness then
                        pool.maxFitness = fitness
                        forms.settext(maxFitnessLabel, "Max Fitness: " .. math.floor(pool.maxFitness))
                        writeFile("backup." .. pool.generation .. "." .. forms.gettext(saveLoadFile))
                end

                console.writeline("Gen " .. pool.generation .. " species " .. pool.currentSpecies .. " genome " .. pool.currentGenome .. " fitness: " .. fitness)
                pool.currentSpecies = 1
                pool.currentGenome = 1
                while fitnessAlreadyMeasured() do
                        nextGenome()
                end
                initializeRun()
        end

        local measured = 0
        local total = 0
        for _,species in pairs(pool.species) do
                for _,genome in pairs(species.genomes) do
                        total = total + 1
                        if genome.fitness ~= 0 then
                                measured = measured + 1
                        end
                end
        end
        if not forms.ischecked(hideBanner) then
                gui.drawText(0, 0, "Gen " .. pool.generation .. " species " .. pool.currentSpecies .. " genome " .. pool.currentGenome .. " (" .. math.floor(measured/total*100) .. "%)", 0xFF000000, 11)
                gui.drawText(0, 12, "Fitness: " .. math.floor(rightmost - (pool.currentFrame) / 2 - (timeout + timeoutBonus)*2/3), 0xFF000000, 11)
                gui.drawText(100, 12, "Max Fitness: " .. math.floor(pool.maxFitness), 0xFF000000, 11)
        end

        pool.currentFrame = pool.currentFrame + 1

        emu.frameadvance();
end
*/
