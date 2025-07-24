import inquirer from 'inquirer';
import { startProcess } from './utils.js';

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
  .then((answers: Record<any, string>) => {
    if (answers.continue) {
      const excelData = newPage.evaluate(async () => {
        const excelData = [];
        const tableData = [
          ...document
            .querySelectorAll('kat-data-table span[data-invoice-data]')
            .values(),
        ]
          .map((spanEle) => {
            const { invoiceData } = (<HTMLSpanElement>spanEle).dataset;
            if (invoiceData == null) return undefined;
            const data = JSON.parse(invoiceData);
            return data;
          })
          .filter((item) => item);

        for (const rowData of tableData) {
          const {
            agreementNumber,
            invoiceLineType,
            invoiceNumber,
            ccogsInvoiceId,
          } = rowData;

          const { agreementText: returnHtmlString } = await fetch(
            `https://vendorcentral.amazon.com/hz/vendor/members/coop/resource/invoice/agreement-text?agreementNumber=${agreementNumber}&invoiceNumber=${invoiceNumber}&invoiceLineType=${invoiceLineType}&ccogsInvoiceId=${ccogsInvoiceId}`
          ).then((res) => res.json());

          const domParser = new DOMParser();
          const doc = domParser.parseFromString(returnHtmlString, 'text/html');
          const productAsin = [
            ...doc.querySelectorAll('table tr.trWhite').values(),
          ].map((trEl) => trEl.querySelectorAll('td').item(1).textContent);

          const returnData = {
            productAsin,
            invoiceNumber,
          };

          excelData.push(returnData);
        }

        return excelData;
      });
    }
  })
  .catch((error: Error) => {
    console.log(error);
    process.exit(1);
  });
