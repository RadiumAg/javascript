async function processData() {
    const excelData = [];
    const tableData = [
        ...document
            .querySelectorAll('kat-data-table span[data-invoice-data]')
            .values(),
    ]
        .map((spanEle) => {
        const { invoiceData } = spanEle.dataset;
        if (invoiceData == null)
            return undefined;
        const data = JSON.parse(invoiceData);
        return data;
    })
        .filter((item) => item);
    for (const rowData of tableData) {
        const { agreementNumber, invoiceLineType, invoiceNumber, ccogsInvoiceId } = rowData;
        const { agreementText: returnHtmlString } = await fetch(`https://vendorcentral.amazon.com/hz/vendor/members/coop/resource/invoice/agreement-text?agreementNumber=${agreementNumber}&invoiceNumber=${invoiceNumber}&invoiceLineType=${invoiceLineType}&ccogsInvoiceId=${ccogsInvoiceId}`).then((res) => res.json());
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
}

const excelScript = document.createElement('script');
const saveAsScript = document.createElement('script');
saveAsScript.src =
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
excelScript.src =
    'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
document.body.appendChild(excelScript);
document.body.appendChild(saveAsScript);
saveAsScript.addEventListener('load', () => {
    excelScript.addEventListener('load', async () => {
        const excelData = await processData();
        const workbook = new window.ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.addRow(['productAsin', 'invoiceNumber']);
        excelData.forEach((row) => {
            worksheet.addRow([row['productAsin'].join(','), row['invoiceNumber']]);
        });
        const buffer = await workbook.xlsx.writeBuffer('output.xlsx');
        window.saveAs(new Blob([buffer]), 'result.xlsx');
    });
});
