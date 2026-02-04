var filename = new Date().toLocaleDateString();
document.getElementById("filename").value = filename;

function showResult() {
    if (masterRunning) {
        if (!confirm('Are you sure? Stop timer and create data.')) return;
        ticker.stop();
        stopAll();
    }
    // check if canvas exists and if not, create it
    if (data.length == 0) {
        alert('There is no data!');
        return;
    }
    createTimeline(0);
    createTimeline(1);
    createTable();
}

function saveTimeline(tlID) {
    // check if canvas exists and if not, create it
    if (data.length == 0) {
        alert('There is no data!');
        return;
    }
    var difID = ["P1P3", "P2P4"];
    if (!document.getElementById("canvasTimeline")) {
        for (var i = 0; i < 2; i++) {
            var divTimeline = document.getElementById("divTimeline" + difID[i]);
            while (divTimeline.lastChild) divTimeline.removeChild(divTimeline.firstChild);
            createTimeline(i);
        }
    }

    var link = document.createElement("a");
    link.setAttribute('download', document.getElementById("filename").value + "_" + difID[tlID] + "_timeline");
    link.href = document.getElementById("canvasTimeline" + difID[tlID]).toDataURL("image/png");
    document.body.appendChild(link);

    link.click();
    link.remove();
}

function getCsvdata() {
    if (data.length == 0) {
        alert('There is no data!');
        return;
    }
    var csvContent = "紀錄時間-起,紀錄時間-迄,行為者,被行為者,行為,影響\n";

    data.forEach(function (dt) {
        csvContent += timeFormating(dt[0]) + ",";
        csvContent += timeFormating(dt[1]) + ",";
        csvContent += pgData[0][dt[2]] + ",";
        csvContent += pgData[1][dt[3]] + ",";
        csvContent += pgData[2][dt[4]] + ",";
        if (pgData[3][dt[5]] == undefined) {
            csvContent += "\n";
        } else {
            csvContent += pgData[3][dt[5]] + "\n";
        }
    });

    filename = document.getElementById("filename").value + '.csv';
    download(csvContent, filename, 'text/csv;encoding:utf-8');
}

function download(content, fileName, mimeType) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';
    if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob(["\uFEFF" + content], {
            type: mimeType
        }), fileName);
    } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob(["\uFEFF" + content], {
            type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
}

function createTable() {
    var tableDiv = document.getElementById("divTable");
    var tableStyle = ["table-danger", "table-warning", "table-primary", "table-success"];
    while (tableDiv.lastChild) {
        tableDiv.removeChild(tableDiv.firstChild);
    }
    var tbhead = ["行為者", "被行為者", "行為", "影響"];
    tbhead.forEach(function (hd, i) {
        var subDiv = document.createElement("div");
        var table = document.createElement('table');
        var capt = document.createElement("caption");
        capt.innerHTML = hd + "數量統計";

        table.appendChild(capt);
        subDiv.appendChild(table);

        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        var tr_h = document.createElement("tr");
        var tr_d = document.createElement("tr");
        var tr_p = document.createElement("tr");


        var th_h = document.createElement("th");
        var th_d = document.createElement("th");
        var th_p = document.createElement("th");

        th_h.appendChild(document.createTextNode(hd));
        th_d.appendChild(document.createTextNode("數量"));
        th_p.appendChild(document.createTextNode("%"));

        tr_h.appendChild(th_h);
        tr_d.appendChild(th_d);
        tr_p.appendChild(th_p);

        var pgDataAll = 0;
        for (var j = 0; j < pgData[i].length; j++) {
            pgDataAll += pgDataCal[i][j];
        }
        console.log(pgDataAll);

        for (var j = 0; j < pgData[i].length; j++) {
            var txt_h = document.createTextNode(pgData[i][j]);
            var txt_d = document.createTextNode(pgDataCal[i][j]);
            var txt_p = document.createTextNode(pgDataAll == 0 ? 0 + "%" : Math.round(pgDataCal[i][j] / pgDataAll * 1000) / 10 + "%");

            var td_h = document.createElement("td");
            var td_d = document.createElement("td");
            var td_p = document.createElement("td");

            td_h.appendChild(txt_h);
            td_d.appendChild(txt_d);
            td_p.appendChild(txt_p);

            tr_h.appendChild(td_h);
            tr_d.appendChild(td_d);
            tr_p.appendChild(td_p);
        }

        var txt_h = document.createTextNode("小計");
        var txt_d = document.createTextNode(pgDataCal[i][pgDataCal[i].length - 1]);
        var txt_p = document.createTextNode(pgDataAll == 0 ? 0 + "%" : "100%");

        var td_h = document.createElement("td");
        var td_d = document.createElement("td");
        var td_p = document.createElement("td");

        td_h.appendChild(txt_h);
        td_d.appendChild(txt_d);
        td_p.appendChild(txt_p);

        tr_h.appendChild(td_h);
        tr_d.appendChild(td_d);
        tr_p.appendChild(td_p);

        thead.appendChild(tr_h);
        tbody.appendChild(tr_d);
        tbody.appendChild(tr_p);
        table.appendChild(thead);
        table.appendChild(tbody);
        table.setAttribute("class", tableStyle[i] + " table text-center table-bordered caption-top");
        subDiv.setAttribute("class", "mb-3 col-12 col-lg-10 col-xl-8 col-xxl-7");
        tableDiv.appendChild(subDiv);
    })
}

function downloadTables(text, filename) {
    var divTB = document.getElementById("divTable");
    if (divTB.innerHTML.length == 0) {
        createTable();
    }
    text = document.getElementById("divTable").outerHTML;
    text = "<!DOCTYPE html><html xml:lang=\"en\" lang=\"en\"><head><meta http-equiv=\"content-type\" content=\"text/html;charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width\"><meta name=\"generator\" content=\"Geany 1.32\" /><!-- Bootstrap CSS --><link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css\" rel=\"stylesheet\"integrity=\"sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU\" crossorigin=\"anonymous\"></head><body>" + text + "</body></html";
    var blob = new Blob([text], { type: "'text/html" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = document.getElementById("filename").value.replace(/([^0-9A-z\u4e00-\u9fa5]|[\^\_])/g, '_') + "_statistics_table.html";
    a.click();
    a.remove();
}


function createTimeline(tlID) {
    var timelineColors = [["#CACF85", "#8CBA80", "#658E9C", "#566E8A", "#4D5382", "#514663"], ["#96BBBB", "#618985", "#414535", "#9A9479", "#F2E3BC", "#C19875"]];
    var ob = ["行為者", "被行為者"];
    var act = ["行為", "影響"];
    if (tlID == 0) {
        var difID = "P1P3"
        var barcolors = timelineColors[0];
    } else if (tlID == 1) {
        var difID = "P2P4";
        var barcolors = timelineColors[1];
    } else {
        alert("Wrong timeline ID, please check.");
    }

    var totalTime = Math.round((data[data.length - 1][1] - startTime) / 1000);
    var labels = [];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = '12px sans-serif';
    canvas.id = "canvasTimeline" + difID;
    var divTimeline = document.getElementById("divTimeline" + difID);
    while (divTimeline.lastChild) divTimeline.removeChild(divTimeline.firstChild);
    divTimeline.appendChild(canvas);

    var plotWidth; // this from lenght of time
    plotWidth = Math.ceil(totalTime / 60) * 30; //30 pixel per min(60sec)

    var iconWidth = 0;
    pgData[tlID + 2].forEach(bhn => {
        var iconLength = ctx.measureText(":" + bhn).width;
        if (iconLength + 5 + 16 > iconWidth) {
            iconWidth = iconLength + 5 + 16;
        }
    });

    plotWidth = plotWidth > (iconWidth + 15) ? plotWidth : iconWidth;

    var textLength = 0;
    pgData[tlID].forEach(obn => {
        labels.push(obn);
        var labelLength = ctx.measureText(obn).width;
        if (labelLength > textLength) {
            textLength = Math.round(labelLength);
        }
    });
    var minCanvasWidth = 50 + ctx.measureText(document.getElementById("filename").value + "_" + difID + "_timeline").width;
    var canvasWidth = plotWidth + textLength + 100;	// add room for totals and then some
    canvas.width = canvasWidth > minCanvasWidth ? canvasWidth : minCanvasWidth;

    // canvas height
    var height = 24; // height of the horizontal bars
    var topMargin = 45;
    var plotHeight = (height + 10) * pgData[tlID].length;
    var iconHeight = 24;
    var canvasHeight = plotHeight + topMargin + 30 + iconHeight * pgData[tlID + 2].length;	// add margin and space for ticks
    canvas.height = canvasHeight;

    var plotStart = textLength + 50; // where the plot starts (x), labels to the left

    //postion for labels
    var pos = [];
    for (var pp = 0; pp < pgData[tlID].length; pp++) {
        //var step = 20;
        pos.push(pp * plotHeight / pgData[tlID].length + topMargin);
    }

    // draw white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // axes
    ctx.fillStyle = "black"; // drawcolor back to black
    ctx.moveTo(plotStart, plotHeight + topMargin);
    ctx.lineTo(plotStart + plotWidth, plotHeight + topMargin);
    ctx.stroke();

    ctx.moveTo(plotStart, plotHeight + topMargin);
    ctx.lineTo(plotStart, topMargin);
    ctx.stroke();

    // Y-ticks and labels
    for (var ii = 0; ii < pgData[tlID].length; ii++) {
        ctx.font = '12px sans-serif';
        ctx.fillText(labels[ii], plotStart - (ctx.measureText(labels[ii]).width + 10), pos[ii] + height / 2 + 5);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        // Draw a tick mark 12px long (-6 to 6)
        ctx.moveTo(plotStart - 6, pos[ii] + height / 2);
        ctx.lineTo(plotStart + 6, pos[ii] + height / 2);
        ctx.stroke();
    }

    // axes labels
    ctx.font = '12px sans-serif';
    ctx.fillText(ob[tlID], textLength + 32, topMargin - 10);
    ctx.fillText("mins", plotStart + plotWidth + ctx.measureText("00").width, plotHeight + topMargin + 25);

    // X-ticks and labels
    ctx.fillText(timeFormating(startTime), plotStart - ctx.measureText("00:00:00").width, plotHeight + topMargin + 30);
    for (var ii = 0; ii <= plotWidth / 30; ii++) {//every 1 min, x-ticks mark
        ctx.beginPath(); //?
        ctx.lineWidth = 1;
        // Draw a tick mark 6px long (-3 to 3)
        ctx.setLineDash([]);
        ctx.strokeStyle = "#000000";
        ctx.moveTo(plotStart + 30 * ii, plotHeight + topMargin);
        ctx.lineTo(plotStart + 30 * ii, plotHeight + topMargin + 10);
        ctx.stroke();
        // Draw gridlines
        if (ii > 0 && ii % 5 == 0) {//every 5 min, solid gridlines
            ctx.beginPath();
            ctx.strokeStyle = "#8c8c8c";
            ctx.moveTo(plotStart + 30 * ii, plotHeight + topMargin - 2);
            ctx.lineTo(plotStart + 30 * ii, topMargin);
            ctx.stroke();
            ctx.font = '12px sans-serif';
            ctx.fillText(ii, plotStart + 30 * ii - 5, plotHeight + topMargin + 25);
        }
        else if (ii > 0) {//every 1 min, dashlines
            ctx.beginPath();
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = "#cccccc";
            ctx.moveTo(plotStart + 30 * ii, plotHeight + topMargin - 2);
            ctx.lineTo(plotStart + 30 * ii, topMargin);
            ctx.stroke();
        }
    }

    //barchart bar rect
    var start, len;
    data.forEach(function (roundDT, i) {
        start = Math.round((roundDT[0] - startTime) / 1000);
        len = Math.round((roundDT[1] - roundDT[0]) / 1000);
        if (roundDT[tlID + 4] != undefined) {
            ctx.fillStyle = barcolors[roundDT[tlID + 4]];
            if (len > 13) {
                ctx.fillRect(plotStart + start / 2, pos[roundDT[tlID + 2]], len / 2, height);
            } else {
                ctx.beginPath();
                ctx.arc(plotStart + start / 2, pos[roundDT[tlID + 2]] + height / 2, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    });

    //instra icon
    var iconX = plotStart + 5;
    var iconY = topMargin + plotHeight + 30;

    pgData[tlID + 2].forEach(function (pgd, i) {

        ctx.fillStyle = barcolors[i];
        ctx.fillRect(iconX, iconY, 16, 16);

        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.fillText(":" + pgd, iconX + 18, iconY + 8);

        iconY += 10 + 16;
    });

    ctx.textBaseline = "alphabetic";

    //logo icon
    var imgObject = document.getElementById("logo");
    ctx.drawImage(imgObject, canvas.width - 50, 0, 50, 18);

    //file name mark
    var filenametxt = document.getElementById("filename").value + "_" + difID + "_timeline";
    ctx.fillStyle = "black";
    ctx.fillText(filenametxt, 0, 10);

    canvas.addEventListener('click', function () {
        window.open().document.write('<img style="max-width: 100%;" src="' + canvas.toDataURL() + '" />');
    }, false);
}

function downloadZipFile() {
    var zip = new JSZip();
    var divTB = document.getElementById("divTable");
    if (divTB.innerHTML.length == 0) {
        createTable();
    }
    /*table*/
    var text = document.getElementById("divTable").outerHTML;
    text = "<!DOCTYPE html><html xml:lang=\"en\" lang=\"en\"><head><meta http-equiv=\"content-type\" content=\"text/html;charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width\"><meta name=\"generator\" content=\"Geany 1.32\" /><!-- Bootstrap CSS --><link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css\" rel=\"stylesheet\"integrity=\"sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU\" crossorigin=\"anonymous\"></head><body>" + text + "</body></html";
    zip.file(document.getElementById("filename").value.replace(/([^0-9A-z\u4e00-\u9fa5]|[\^\_])/g, '_') + "_statistics_table.html", text);


    //Timeline image
    difID = ["P1P3", "P2P4"];
    for (var i = 0; i < 2; i++) {
        var divTimeline = document.getElementById("canvasTimeline" + difID[i]);
        if (!divTimeline)
            createTimeline(i);
        var img = document.getElementById("canvasTimeline" + difID[i]).toDataURL("image/png");
        img = img.split('base64,')[1];
        zip.file((document.getElementById("filename").value.replace(/([^0-9A-z\u4e00-\u9fa5]|[\^\_])/g, '_') + "_" + difID[i] + "_timeline.png"), img, { base64: true, createFolders: false });
        console.log(zip.file);
    }


    //CSV file
    var csvContent = "紀錄時間-起,紀錄時間-迄,行為者,被行為者,行為,影響\n";
    //for (i = 0; i < constOBnum; i++)content[i] = (i + 1) + ",";//Serial number

    data.forEach(function (dt) {
        csvContent += timeFormating(dt[0]) + ",";
        csvContent += timeFormating(dt[1]) + ",";
        csvContent += pgData[0][dt[2]] + ",";
        csvContent += pgData[1][dt[3]] + ",";
        csvContent += pgData[2][dt[4]] + ",";
        if (pgData[3][dt[5]] == undefined) {
            csvContent += "\n";
        } else {
            csvContent += pgData[3][dt[5]] + "\n";
        }
    });

    zip.file(document.getElementById("filename").value.replace(/([^0-9A-z\u4e00-\u9fa5]|[\^\_])/g, '_') + '.csv', "\uFEFF" + csvContent, { createFolders: false })



    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, document.getElementById("filename").value.replace(/([^0-9A-z\u4e00-\u9fa5]|[\^\_])/g, '_') + "_all_files.zip");
        });
}

function iconPattern(patSelect, colorSelect, edge) {
    var color = ["#338CD5", "#7F8B92", "#DAE2D5", "#66FFF0", "#E15666", "#FFC471", "white"];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = edge;
    canvas.height = edge;
    ctx.lineWidth = 3 / 25 * edge;
    ctx.fillStyle = color[colorSelect];
    ctx.fillRect(0, 0, edge, edge);
    ctx.fillStyle = 'black';

    switch (patSelect) {
        case 0:// 斜線/
            ctx.beginPath();
            ctx.moveTo(-1, 1);
            ctx.lineTo(1, -1);
            ctx.moveTo(edge / 2 + 1, -1);
            ctx.lineTo(-1, edge / 2 + 1);
            ctx.moveTo(edge + 1, -1);
            ctx.lineTo(-1, edge + 1);
            ctx.moveTo(edge + 1, edge / 2 - 1);
            ctx.lineTo(edge / 2 - 1, edge + 1);
            ctx.moveTo(edge - 1, edge + 1);
            ctx.lineTo(edge + 1, edge - 1);
            ctx.stroke();
            break;
        case 1:// 斜線\
            ctx.beginPath();
            ctx.moveTo(edge - 1, -1);
            ctx.lineTo(edge + 1, 1);
            ctx.moveTo(edge / 2 - 1, -1);
            ctx.lineTo(edge + 1, edge / 2 + 1);
            ctx.moveTo(-1, -1);
            ctx.lineTo(edge + 1, edge + 1);
            ctx.moveTo(-1, edge / 2 - 1);
            ctx.lineTo(edge / 2 + 1, edge + 1);
            ctx.moveTo(-1, edge - 1);
            ctx.lineTo(1, edge + 1);
            ctx.stroke();
            break;
        case 2://直線|
            ctx.beginPath();
            ctx.moveTo(0, -1);
            ctx.lineTo(0, edge + 1);
            ctx.moveTo(edge / 2, -1);
            ctx.lineTo(edge / 2, edge + 1);
            ctx.moveTo(edge, -1);
            ctx.lineTo(edge, edge + 1);
            ctx.stroke();
            break;
        case 3://橫線－
            ctx.beginPath();
            ctx.moveTo(-1, 0);
            ctx.lineTo(edge + 1, 0);
            ctx.moveTo(-1, edge / 2);
            ctx.lineTo(edge + 1, edge / 2);
            ctx.moveTo(-1, edge);
            ctx.lineTo(edge + 1, edge);
            ctx.stroke();
            break;
        case 4://圓形○
            ctx.beginPath();
            ctx.arc(edge / 2, edge / 2, edge / 4, 0, 2 * Math.PI);
            ctx.lineWidth = 2 / 25 * edge;
            ctx.stroke();
            break;
        case 5://三角形△
            ctx.beginPath();
            ctx.moveTo(edge / 2, edge * 0.284);
            ctx.lineTo(edge / 4, edge * 0.717);
            ctx.lineTo(edge / 4 * 3, edge * 0.717);
            ctx.closePath();
            ctx.lineWidth = 2 / 25 * edge;
            ctx.stroke();
            break;
        case 6://空白
            ctx.fillStyle = color[colorSelect];
            ctx.beginPath();
            ctx.fillRect(0, 0, edge, edge);
            break;
    }

    return canvas;
}