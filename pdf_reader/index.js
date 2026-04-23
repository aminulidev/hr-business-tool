const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('../CalcHub_Passive_Income_Strategy_Report.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('../pdf_output.txt', data.text);
    console.log('PDF parsed and saved to pdf_output.txt');
}).catch(function(error){
    console.log('Error parsing PDF:', error);
});
