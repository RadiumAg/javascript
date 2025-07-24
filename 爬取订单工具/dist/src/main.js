import inquirer from 'inquirer';
import { exportExcel, processData, startProcess } from './utils.js';
const newPage = await startProcess();
inquirer
    .prompt([
    {
        type: 'confirm',
        name: 'continue',
        message: '是否继续？',
        default: true,
    },
])
    .then(async (answers) => {
    if (answers.continue) {
        const excelData = await newPage.evaluate(processData);
        await exportExcel(excelData);
    }
})
    .catch((error) => {
    console.log(error);
    process.exit(1);
});
