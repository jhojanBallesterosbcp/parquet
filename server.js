const parquet = require('parquetjs-lite');
const XLSX = require('xlsx');

async function parquetToExcel(parquetFilePath, excelFilePath) {
  try {
    // Abre el archivo Parquet
    let reader = await parquet.ParquetReader.openFile(parquetFilePath);

    // Obtén el cursor para leer los registros
    let cursor = reader.getCursor();
    let records = [];
    let record = null;

    // Lee todos los registros del archivo Parquet
    while (record = await cursor.next()) {
      records.push(record);
    }

    // Cierra el lector Parquet
    await reader.close();

    // Crea un nuevo libro de Excel
    let workbook = XLSX.utils.book_new();

    // Convierte los registros a una hoja de Excel
    let worksheet = XLSX.utils.json_to_sheet(records);

    // Agrega la hoja al libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Escribe el archivo Excel
    XLSX.writeFile(workbook, excelFilePath);

    console.log(`Archivo Excel creado con éxito en: ${excelFilePath}`);
  } catch (error) {
    console.error('Error al convertir Parquet a Excel:', error);
  }
}

// Ejemplo de uso
parquetToExcel('data/clients2.gz.parquet', 'data/clients.xlsx');
