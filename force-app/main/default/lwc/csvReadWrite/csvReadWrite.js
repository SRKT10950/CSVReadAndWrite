import { LightningElement } from 'lwc';
import csvHandler from '@salesforce/apex/CSVReadWriteController.csvHandler';
import parseCSV from '@salesforce/apex/CsvBatchController.parseCSV';

export default class CsvReadWrite extends LightningElement {
    csvData;
    rowNumber = 2;
    columnCount = 0;
    columnCountRequired = false;
    headerRequired = false;
    headerObj = {};
    tempHeader = [];
    radioHeaderValue = 'Default';
    get options() {
        return [
            { label: 'Default', value: 'Default' },
            { label: 'With out Header', value: 'WithOutHeader' },
        ];
    }
    /**
     * The function handles file uploads and reads the first uploaded file.
     * @param event - The event parameter is an object that contains information about the file upload
     * event, such as the files that were uploaded. It is typically passed as an argument to an event
     * handler function that is triggered when a file is uploaded.
     */
    handleFileUpload(event) {
        if (this.validate()) {
            let files = event.detail.files;
            if (files.length > 0) {
                let file = files[0];
                // start reading the uploaded file
                this.read(file);
            }
        } else {
            event.preventDefault();
        }
    }
    handleInput(event) {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        switch (fieldName) {
            case 'hasHeader':
                this.columnCountRequired = false;
                this.headerRequired = false;
                this.columnCount = 0;
                if (fieldValue == 'WithOutHeader') {
                    this.columnCountRequired = true;
                    this.rowNumber = 1;
                } else if (fieldValue == 'Custom') {
                    this.headerRequired = true;
                }
                this.radioHeaderValue = fieldValue;
                break;
            case 'header':
                this.tempHeader = fieldValue.split(',');
                break;
            case 'columnCount':
                this.columnCount = fieldValue;
                break;
            case 'rowNumber':
                this.rowNumber = fieldValue;
                if (this.rowNumber === 0) {
                    this.rowNumber = 1;
                }
                break;

            default:
                break;
        }
    }
    /**
     * This is an asynchronous function that reads a file, loads it, and then parses it.
     * @param file - The "file" parameter is the file that needs to be read and parsed. It is passed as
     * an argument to the "read" function.
     */
    async read(file) {
        try {
            this.csvData = await this.load(file);
            console.log('csvData : ' + this.csvData);
            // execute the logic for parsing the uploaded csv file
            this.parse(this.csvData);
        } catch (e) {
            this.error = e;
        }
    }
    apexCSVHandler(csvData) {
        csvHandler({ csvData: csvData })
            .then(result => {
                this.success = " File process Successfully!!";
            })
            .catch(error => {
                this.failure = error;
            });
    }
    /**
     * This is an asynchronous function that loads a file and returns a promise that resolves with the
     * file's contents as a string.
     * @param file - The "file" parameter is the file that needs to be loaded and read by the FileReader
     * object. It is passed as an argument to the "load" function.
     * @returns A Promise object is being returned.
     */
    async load(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsText(file);
        });
    }

    parse(csv) {
        // parse the csv file and treat each line as one item of an array
        let lines = csv.split(/\r\n|\n/);
        //For direct process into class.
        parseCSV({ csvrowsData: lines })
            .then(result => {
                console.log('parse: ' + result);
            })
            .catch(error => {
                this.handleError(error);
            });
        let headers = [];
        let stopArray = false;
        let data = [];
        // parse the first line containing the csv column headers
        if (this.radioHeaderValue == 'Default') {
            headers = lines[0].split(',');
            this.columnCount = headers.length;
        } else if (this.radioHeaderValue == 'Custom') {
            headers = this.tempHeader;
            this.columnCount = headers.length;
        }
        // iterate through csv file rows
        lines.forEach((line, i) => {
            if (i < (this.rowNumber - 1)) {
                return;
            }
            let obj = [];
            let currentLine = line.split(',');
            for (let j = 0; j < this.columnCount; j++) {
                if (currentLine[0] != null && currentLine[0] != '') {
                    if (currentLine[j] == null) {
                        currentLine[j] = '';
                        obj.push(currentLine[j].trim());
                    } else {
                        obj.push(currentLine[j].trim());
                    }
                } else {
                    stopArray = true;
                    break;
                }
            }
            if (stopArray === false) {
                data.push(obj);
            }
        });
        this.apexCSVHandler(JSON.stringify(data));
    }
    /**
     * It loops through all the input fields in the form and checks if they are valid. If they are not
     * valid, it sets the error message to the label of the first invalid field and scrolls to it
     * @returns A boolean value.
     */
    validate() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
}
