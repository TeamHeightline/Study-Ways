import * as XLSX from "xlsx";
import FileSaver from 'file-saver'

export default function CreateExcelFile({columns, data, fileName}: {
    columns: string[],
    data: any[][],
    fileName: string
}) {
    const data_with_column_name = [columns, ...data]
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const work_sheet = XLSX.utils.aoa_to_sheet(data_with_column_name);
    work_sheet["!cols"] = columns.map(col => ({wch: 25}))
    const work_book = {Sheets: {'data': work_sheet}, SheetNames: ['data']};
    const excelBuffer = XLSX.write(work_book, {bookType: 'xlsx', type: 'array'});
    const dataBlob = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(dataBlob, fileName + fileExtension);
}
