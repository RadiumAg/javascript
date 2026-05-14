const toolList = new Map<
  string,
  {
    description: string;
    func: (...args: any[]) => any;
  }
>();
/**
 *
 * 一个工具执行器，负责管理和执行工具
 *
 * @param name
 * @param description
 * @param callable
 */
const registerTool = (
  name: string,
  description: string,
  func: (...args: any[]) => any,
) => {
  toolList.set(name, { description, func });
};

const getTool = (name: string) => {
  toolList.get(name)?.func;
};

const getAvailableTools = () => {
  return Object.entries(toolList)
    .map(([name, info]) => `- ${name}: ${info.description}`)
    .join('\n');
};
export { getTool, registerTool, getAvailableTools };
