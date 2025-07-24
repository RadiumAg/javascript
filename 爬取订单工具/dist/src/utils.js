import puppeteer from 'puppeteer-core';
import ExcelJS from 'exceljs';
async function startProcess() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
        headless: false, // 使用全新 Headless 模式
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://vendorcentral.amazon.com/hz/vendor/members/coop?ref_=vc_xx_favb');
    return page;
}
async function exportExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.addRow(['productAsin', 'invoiceNumber']);
    await workbook.xlsx.writeFile('output.xlsx');
}
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
export { startProcess, exportExcel, processData };
