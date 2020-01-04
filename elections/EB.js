function loadEB(divId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(divId).innerHTML = buildEB(this,divId);
        }
    };
    xhttp.open('GET','EDB.xml');
    xhttp.send();
}





function buildEB(xml,divId) {
    var doc = xml.responseXML;
    var election = doc.getElementById(divId.substring(0,8));
    var reg = election.querySelector('div[name='+divId.substring(8,10)+']');
    
    console.log('Loading '+divId);
    console.log(reg); // Reg is the regional result
    
    var table = '<table style="width:80%;margin:auto;">' // Opening
    table += '<tr><td colspan="3" style="text-align:center;font-size:200%;font-family:GothamMedium;">'+election.getAttribute('name')+'</td></tr>'; // Header
    if (election.getAttribute('parties') == 'yes') { // Seats graph if party
        table += '<tr><td colspan="3" style="text-align:center;"><img width="50%" src="../diagrams/'+divId.substring(0,8)+'.svg"></td></tr>';
    }
    table += '<tr><td colspan="3"><img width="100%" src="../maps/'+divId.substring(0,8)+'.svg"></td></tr>'; // Map
    
    
    
    var i; // Looping through all candidates
    for (i=0;i<reg.childElementCount;i++) {
        var candidate = reg.children[i];
        var row = '';
        
        // Image (not if party)
        if (election.getAttribute('parties') == 'no') {
            row += '<tr><td width="auto">';
            console.log(candidate.getAttribute('name'))
            if (ImageExist('../images/'+candidate.getAttribute('name')+'.png')) {
                row += '<img width="37.2px" src="../images/'+candidate.getAttribute('name')+'.png" style="display:block;">'
            } else {
                row += '<img width="37.2px" src="../images/placeholder.png" style="display:block;">'
            }
            row += '</td>'
        }
        
        // Name
        if (candidate.getAttribute('elected')) {elected = 'font-weight:bold;';} else {elected = '';}
        if (candidate.getAttribute('party') == 'no') {
            row += '<td width="auto" style="padding:3px;font-size:125%;white-space:nowrap;'+elected+'">'+candidate.getAttribute('name')+' <abbr title="'+PartyName(candidate.getAttribute('party'))+'" style="text-decoration:none;">('+candidate.getAttribute('party')+')</abbr></td>';
        } else {
            row += '<td width="auto" style="padding:3px;font-size:175%;white-space:nowrap;'+elected+'">'+'<abbr title="'+candidate.getAttribute('name')+'" style="text-decoration:none;">'+candidate.getAttribute('party')+'</abbr></td>';
        }
        
        
        
        
        
        
        
        
        
        // Scorebar
        score = Math.round(1000*candidate.getAttribute('votes') / reg.getAttribute('totalvotes'))/10
        
        if (election.getAttribute('parties') == 'no') {row += '<td width="100%" style="background-image:';} else {row += '<td width="50%" style="background-image:';}
        if (candidate.getAttribute('rank') == 1) {
            if (score < 49.75) {
                row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%,#F0F0F0 49.25%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
            } else if (score > 50.25) {
                row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 49.75%,black 49.75%,black 50.25%,'+PartyColor(candidate.getAttribute('party'))+' 50.25%,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
            } else {
                row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 0%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
            }
        } else {
            row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
        }
        row += ';text-align:right;font-size:150%;'+elected+'">';
        row += '<abbr style="text-decoration:none;" title="'+candidate.getAttribute('votes')+' votes"><ruby>'+score+'%<rt>'+candidate.getAttribute('change')+'</rt></ruby></abbr></td>';
        
        
        
        score = Math.round(1000*candidate.getAttribute('seats') / reg.getAttribute('totalseats'))/10
        
        if (election.getAttribute('parties') == 'yes') { // Number of seats
            row += '<td width="25%" style="background-image:';
            if (candidate.getAttribute('rank') == 1) {
                if (score < 49.75) {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%,#F0F0F0 49.25%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
                } else if (score > 50.25) {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 49.75%,black 49.75%,black 50.25%,'+PartyColor(candidate.getAttribute('party'))+' 50.25%,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
                } else {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 0%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
                }
            } else {
                row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
            }
            row += ';text-align:right;font-size:150%;'+elected+'">';
            row += '<ruby>'+candidate.getAttribute('seats')+' seats<rt>'+candidate.getAttribute('change')+'</rt></ruby></td>';
        }
        
        
        
        
        
        
        
        
        
        
        row += '</tr>'
        table += row
    }
    table += '</table>';
    return(table);
}

function ImageExist(url) {
    var img = new Image();
    img.src = url;
    return img.height != 0;
}

function PartyName(abbr) {
    switch(abbr) {
        case 'D': return('Democratic Party');
        case 'R': return('Republican Party');
        case 'I': return('Independent');
        default: return('No Party Preference');
    }
}

function PartyColor(abbr) {
    switch(abbr) {
        case 'D': return('#3333FF');
        case 'G': return('#00A95C');
        case 'MWP': return('#CC8960');
        case 'R': return('#E81B23');
        case 'I': return('gray');
        default: return('gainsboro');
    }
}