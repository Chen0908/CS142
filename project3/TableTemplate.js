'use strict';

class TableTemplate {
    static fillIn (id, dict, columnName) {
        var tableElem = document.getElementById(id);
        var rows = tableElem.rows;
        var processor = new Cs142TemplateProcessor(rows[0].innerHTML);
        rows[0].innerHTML = processor.fillIn(dict);

        var colToUpdate;
        if (typeof columnName !== 'undefined') {
            colToUpdate = (function (cells) {
                for (let i = 0; i < cells.length; i++) {
                    if (columnName.indexOf(cells[i].innerHTML) !== -1) { return [i]; }
                }
                return [];
            }(rows[0].cells));
        }
        else {
            colToUpdate = Array.from(Array(rows[0].cells.length).keys());
        }
        
        
        for (let i = 1; i < rows.length; i++) {
            for (let j in colToUpdate) {
                var col = colToUpdate[j];
                var cellText = rows[i].cells[col].innerHTML;
                processor = new Cs142TemplateProcessor(cellText);
                rows[i].cells[col].innerHTML = processor.fillIn(dict);
            }
        }

        tableElem.style.visibility = 'visible';
    }
}