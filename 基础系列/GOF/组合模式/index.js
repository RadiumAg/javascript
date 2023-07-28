'use strict';

const MacroCommand = function () {
  return {
    commandsList: [],
    add(command) {
      this.commandsList.push(command);
    },
    execute() {
      for (
        var i = 0, command;
        (command = this.commandsList[i++]);
        i < this.commandsList.length
      ) {
        command.execute();
      }
    },
  };
};

const openAcCommand = {
  execute() {
    console.log('打开电视');
  },
};

const openTvCommand = {
  execute() {
    console.log('打开电视');
  },
};

const openSoundCommand = {
  execute() {
    console.log('打开音响');
  },
};

const macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);

const closeDoorComannd = {
  execute() {
    console.log('关门');
  },
};

const openPcCommand = {
  execute() {
    console.log('开电脑');
  },
};

const openQQComand = {
  execute() {
    console.log('登录QQ');
  },
};

const macroCommand2 = MacroCommand();
macroCommand2.add(closeDoorComannd);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQComand);

const macroCommand = MacroCommand();
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);
macroCommand.add(macroCommand);

macroCommand.execute();
