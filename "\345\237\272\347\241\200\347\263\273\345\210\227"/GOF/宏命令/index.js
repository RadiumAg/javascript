'use strict';
let closeDoorCommand = {
    execute: function () {
        console.log('关门');
    }
}

let openPcCommand = {
    execute:function(){
        console.log('开电脑');
    }
}

let openQQComand = {
    execute:function(){
        console.log('登录QQ');
    }
}

let MacroCommand = function(){
    return{
        commandsList:[],
        add:function( command ){
            this.commandsList.push(command);
        },
        execute:function(){
            for(let i = 0,command; command = this.commandsList[i++];){
                command.execute();
            }
        }
    }
}


let macroCommand = new MacroCommand();

macroCommand.add( closeDoorCommand );
macroCommand.add( openPcCommand );
macroCommand.add ( openQQComand);
macroCommand.execute();