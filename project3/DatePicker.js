'use strict';

function FixedDate(month, day, year){
    this.year = year;
    this.month = month;
    this.day = day;
}

function DatePicker(id, callback){
    this.initialize(id, callback);
    this.setHeader();
}

DatePicker.prototype.render = function(date){
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.updateView(date);    
};

DatePicker.prototype.initialize = function(id, callback){
    this.id = id;
    this.ele = document.getElementById(id);
    this.callback = callback;
    this.container = document.createElement('div');
    this.table = document.createElement('table'); 
    this.decreaseMonth = document.createElement('button');
    this.increaseMonth = document.createElement('button');
    this.setDecreaseMonthHandler(this.decreaseMonth, this);
    this.setIncreaseMonthHandler(this.increaseMonth, this);
    this.topText = document.createElement('th');
    this.dayMap = {0:31,1:28,2:31,3:30,4:31,5:30,6:31,7:31,8:30,9:31,10:30,11:31};
    this.month = undefined;
    this.year = undefined;
};

DatePicker.prototype.updateView = function(date){
   
    while(this.table.rows.length > 2){
        this.table.deleteRow(this.table.rows.length - 1);
    } 
   
    var month = date.getMonth();
    var year = date.getFullYear();
    
    this.topText.textContent = (month + 1) + '/' + year;
    
    if(this.isLeapYear(year)) {
        this.dayMap[1] = 29;
    }
    else{
        this.dayMap[1] = 28;
    }

    var daysInLastMonth = this.getDaysInLastMonths(month, new Date(year, month, 1).getDay());
    var daysInNextMonth = this.getDaysInNextMonths(month, new Date(year, month, this.dayMap[month]).getDay());
    var daysInThisMonth = [];
    for(let i = 1; i <= this.dayMap[month]; i++){
        daysInThisMonth.push(i);
    }
    
    this.arrangeDaysInTable(daysInLastMonth, daysInThisMonth, daysInNextMonth);
};

DatePicker.prototype.arrangeDaysInTable = function(daysInLastMonth, daysInThisMonth, daysInNextMonth){
    var i1 = 0, i2 = 0, i3 = 0;

    while(i1 < daysInLastMonth.length || i2 < daysInThisMonth.length || i3 < daysInNextMonth.length){
        var curRow = document.createElement('tr');
        for(let i = 0;i <= 6; i++){
            var curVal = document.createElement('td');
            if(i1 < daysInLastMonth.length){
                curVal.textContent = daysInLastMonth[i1++];
                curVal.className = 'outBound';
            }
            else if(i2 < daysInThisMonth.length){
                curVal.textContent = daysInThisMonth[i2++];
                curVal.className = 'inBound';   
                this.setSelectDateHandler(curVal, this);
            }
            else if(i3 < daysInNextMonth.length){
                curVal.textContent = daysInNextMonth[i3++];
                curVal.className = 'outBound';
            }
            curRow.appendChild(curVal);
        }
        this.table.appendChild(curRow);
    }  
};

DatePicker.prototype.setSelectDateHandler = function(ele, parent){ 
    if(typeof parent.callback === 'function'){
        ele.onclick = function(){
            var prevSelected = document.getElementById('selected');
            if(prevSelected !== null){
                prevSelected.id = null;
            }
            ele.id = 'selected';

            parent.callback(parent.id, new FixedDate(parent.month + 1,  Number(ele.textContent), parent.year));
        };
    }
};

DatePicker.prototype.setDecreaseMonthHandler = function(ele, parent){
    ele.onclick = function(){
        if(parent.month === undefined || parent.year === undefined){
            return;
        }
            

        if(parent.month === 0){
            parent.month = 11;
            parent.year--;
        }
        else{
            parent.month--;
        }
        parent.updateView(new Date(parent.year, parent.month));
    };
};

DatePicker.prototype.setIncreaseMonthHandler = function(ele, parent){
    ele.onclick = function(){
        if(parent.month === undefined || parent.year === undefined){
            return;
        }
        if(parent.month === 11){
            parent.year++;
            parent.month = 0;
        }
        else{
            parent.month++;
        }   
        parent.updateView(new Date(parent.year, parent.month));
    };
};

DatePicker.prototype.setHeader = function(){

    var thead = document.createElement('thead');
    
    var top = document.createElement('tr');
    var leftBotton = document.createElement('th');
    this.decreaseMonth.textContent = '<';
    leftBotton.appendChild(this.decreaseMonth);
    
    this.topText.colSpan = '5';
    this.topText.textContent = 'xx/xxxx';
    var rightBotton = document.createElement('th');
    this.increaseMonth.textContent = '>';
    rightBotton.appendChild(this.increaseMonth);
    
    top.appendChild(leftBotton);
    top.appendChild(this.topText);
    top.appendChild(rightBotton);
    
    thead.appendChild(top);
    
    var header = document.createElement('tr');
    var daysInWeek = ['Su', 'Mo','Tu','We','Th','Fr','Sa'];
    for(let i = 0; i < daysInWeek.length; i++){
        var tmp = document.createElement('th');
        tmp.textContent = daysInWeek[i];
        header.appendChild(tmp);
    }

    thead.appendChild(header);
    this.table.appendChild(thead);
    
    this.container.appendChild(this.table);
    this.ele.appendChild(this.container);
    
};

DatePicker.prototype.isLeapYear = function(year){
    if(year % 100 !== 0 && year % 4 === 0) {return true;}
    if(year % 100 === 0 && year % 400 === 0) {return true;}
    return false;
};

DatePicker.prototype.getDaysInLastMonths = function(month, firstDay){
    var daysInLastMonths = [];
    var maxDayLastMonth;
    if(month === 0){
        maxDayLastMonth = 31;
    }
    else{
        maxDayLastMonth = this.dayMap[month-1];
    }
    for(let i = 0;i < firstDay; i++){
        daysInLastMonths.push(maxDayLastMonth - firstDay  + i  + 1);
    }
    return daysInLastMonths;
};

DatePicker.prototype.getDaysInNextMonths = function(month, lastDay){
    var daysInNextMonth = [];
    var start = 1;
    for(let i = lastDay + 1; i <= 6; i++){
        daysInNextMonth.push(start++);
    }
    return daysInNextMonth;
};



