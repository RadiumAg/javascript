'use strict';
const closeDoorCommand = {
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

const MacroCommand = function () {
  return {
    commandsList: [],
    add(command) {
      this.commandsList.push(command);
    },
    execute() {
      for (let i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute();
      }
    },
  };
};

const macroCommand = new MacroCommand();

macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQComand);
macroCommand.execute();
