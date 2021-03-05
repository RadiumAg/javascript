'use strict';

var MacroCommand = function(){
    return{
        commandsList:[],
        add(command){
           this.commandsList.push(command);
        },
        execute(){
            for(var i = 0,command; command = this.commandsList[i++]; i<this.commandsList.length) {
                command.execute();
            }
        }
    }
}


var openAcCommand = {
    execute(){
        console.log('打开电视');
    }
}


var openTvCommand = {
    execute(){
        console.log('打开电视');
    }
}

var openSoundCommand = {
    execute(){
        console.log('打开音响');
    }
}

var macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);


var closeDoorComannd = {
    execute(){
        console.log('关门');
    }
}

var openPcCommand = {
    execute(){
        console.log('开电脑');
    }
}

var openQQComand = {
    execute(){
        console.log('登录QQ');
    }
}

var macroCommand2  = MacroCommand();
macroCommand2.add(closeDoorComannd);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQComand);

var macroCommand = MacroCommand();
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);
macroCommand.add(macroCommand);


macroCommand.execute();
