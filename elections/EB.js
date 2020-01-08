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
    
    var table = '<table style="width:80%;margin:auto;">' // Opening
    table += '<tr><td colspan="3" style="text-align:center;font-size:200%;font-family:GothamMedium;">'+election.getAttribute('name')+'</td></tr>'; // Header
    if (election.getAttribute('parties') == 'yes' && reg.getAttribute('name') == 'us') { // Seats graph if party
        table += '<tr><td colspan="3" style="text-align:center;"><img width="50%" src="../diagrams/'+divId.substring(0,8)+'.svg"></td></tr>';
    }
    if (reg.getAttribute('name') == 'us') {
        table += '<tr><td colspan="3"><img width="100%" src="../maps/'+divId.substring(0,8)+'.svg"></td></tr>'; // Map
    }
    
    
    
    var i; // Looping through all candidates
    for (i=0;i<reg.childElementCount;i++) {
        var candidate = reg.children[i];
        var row = '';
        
        
        
        
        // DIRECT CANDIDATE
        if (candidate.tagName == 'candidate') {
            // Image (not if party)
            if (election.getAttribute('parties') == 'no' || reg.getAttribute('name') != 'us') {
                row += '<tr><td width="auto">';
                row += '<img width="37.2px" src="../images/'+candidate.getAttribute('name')+'.png" style="display:block;">'
                row += '</td>'
            }

            // Name
            if (candidate.getAttribute('elected') == 'yes') {elected = 'font-weight:bold;';} else if (candidate.getAttribute('elected') == 'r') {elected = 'font-style:italic;'} else {elected = '';}
            if (election.getAttribute('parties') == 'yes' && reg.getAttribute('name') == 'us') {
                row += '<td width="10%" style="padding:3px;font-size:175%;white-space:nowrap;'+elected+'">'+'<abbr title="'+candidate.getAttribute('name')+'" style="text-decoration:none;">'+candidate.getAttribute('party')+'</abbr></td>';
            } else {
                row += '<td width="25%" style="padding:3px;font-size:125%;white-space:nowrap;'+elected+'">'+candidate.getAttribute('name')+' <abbr title="'+PartyName(candidate.getAttribute('party'))+'" style="text-decoration:none;">('+candidate.getAttribute('party')+')</abbr></td>';
            }

            // Scorebar
            score = Math.round(1000*candidate.getAttribute('votes') / reg.getAttribute('totalvotes'))/10

            if (election.getAttribute('parties') == 'no' || reg.getAttribute('name') != 'us') {row += '<td width="100%" style="background-image:';} else {row += '<td width="50%" style="background-image:';}
            if (candidate.getAttribute('rank') == 1) {
                if (score < 49.75) {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%,#F0F0F0 49.75%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
                } else if (score > 50.25) {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 49.75%,black 49.75%,black 50.25%,'+PartyColor(candidate.getAttribute('party'))+' 50.25%,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
                } else {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 49.75%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
                }
            } else {
                row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
            }
            row += ';text-align:right;font-size:150%;'+elected+'">';
            row += '<abbr style="text-decoration:none;" title="'+candidate.getAttribute('votes')+' votes"><ruby>'+score+'%<rt>'+candidate.getAttribute('change')+'</rt></ruby></abbr></td>';

            score = Math.round(1000*candidate.getAttribute('seats') / reg.getAttribute('totalseats'))/10

            if (election.getAttribute('parties') == 'yes' && reg.getAttribute('name') == 'us') { // Number of seats
                row += '<td width="25%" style="background-image:';
                if (candidate.getAttribute('rank') == 1) {
                    if (score < 49.75) {
                        row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%,#F0F0F0 49.25%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
                    } else if (score > 50.25) {
                        row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 49.75%,black 49.75%,black 50.25%,'+PartyColor(candidate.getAttribute('party'))+' 50.25%,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
                    } else {
                        row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' 49.75%,black 49.75%,black 50.25%,#F0F0F0 50.25%)';
                    }
                } else {
                    row += 'linear-gradient(90deg,'+PartyColor(candidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
                }
                row += ';text-align:right;font-size:150%;'+elected+'">';
                row += '<ruby>'+candidate.getAttribute('seats')+' seat';
                if (candidate.getAttribute('seats') != 1) {row += 's'}
                row += '<rt>'+candidate.getAttribute('change')+'</rt></ruby></td>';
                row += '</tr>'
            }
        } else if (candidate.tagName == 'primary') {
            prim = candidate;
            row += '<tr><td colspan="3" style="text-align:center;" onclick="toggler(this.parentNode.parentNode.nextSibling);">';
            row += PartyName(candidate.getAttribute('party'))+' primaries ▼';
            row += '</td></tr>';
            row += '<tbody class="prim-collapsible">'
            
            var j = 0;
            for (j=0;j<prim.childElementCount;j++) {
                tempcandidate = prim.children[j];
                
                
                
                
                // Image (not if party)
                row += '<tr><td width="auto;">';
                row += '<img width="37.2px" src="../images/'+tempcandidate.getAttribute('name')+'.png" style="display:block;">'
                row += '</td>'

                // Name
                if (tempcandidate.getAttribute('nominee') == 'yes') {nominee = 'font-weight:bold;';} else if (tempcandidate.getAttribute('nominee') == 'r') {nominee = 'font-style:italic;'} else {nominee = '';}
                row += '<td width="25%" style="padding:3px;white-space:nowrap;'+nominee+'">'+tempcandidate.getAttribute('name')+' <abbr title="'+PartyName(prim.getAttribute('party'))+'" style="text-decoration:none;">('+prim.getAttribute('party')+')</abbr></td>';

                // Scorebar
                score = Math.round(1000*tempcandidate.getAttribute('votes') / prim.getAttribute('totalvotes'))/10

                if (election.getAttribute('parties') == 'no' || reg.getAttribute('name') != 'us') {row += '<td width="100%" style="background-image:';} else {row += '<td width="50%" style="background-image:';}
                row += 'linear-gradient(90deg,'+PartyColor(prim.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
                row += ';text-align:right;font-size:125%;'+nominee+'">';
                row += '<abbr style="text-decoration:none;" title="'+tempcandidate.getAttribute('votes')+' votes">'+score+'%</abbr></td></tr>';
            } 
            row += '</tbody>'
            
        } else if (candidate.tagName == 'runoff') {
            runoff = candidate;
            row += '<tr><td colspan="3" style="text-align:center;" onclick="toggler(this.parentNode.parentNode.nextSibling);">';
            row += 'Runoff';
            row += '</td></tr>';
            row += '<tbody class="runoff-collapsible">'
            
            var j = 0;
            for (j=0;j<runoff.childElementCount;j++) {
                tempcandidate = runoff.children[j];
                console.log(tempcandidate)
                
                
                
                
                // Image (not if party)
                row += '<tr><td width="auto;">';
                row += '<img width="37.2px" src="../images/'+tempcandidate.getAttribute('name')+'.png" style="display:block;">'
                row += '</td>'

                // Name
                if (tempcandidate.getAttribute('elected') == 'yes') {elected = 'font-weight:bold;';} else {elected = '';}
                row += '<td width="25%" style="padding:3px;white-space:nowrap;'+elected+'">'+tempcandidate.getAttribute('name')+' <abbr title="'+PartyName(tempcandidate.getAttribute('party'))+'" style="text-decoration:none;">('+tempcandidate.getAttribute('party')+')</abbr></td>';

                // Scorebar
                score = Math.round(1000*tempcandidate.getAttribute('votes') / candidate.getAttribute('totalvotes'))/10

                if (election.getAttribute('parties') == 'no' || reg.getAttribute('name') != 'us') {row += '<td width="100%" style="background-image:';} else {row += '<td width="50%" style="background-image:';}
                row += 'linear-gradient(90deg,'+PartyColor(tempcandidate.getAttribute('party'))+' '+score+'%,#F0F0F0 '+score+'%)';
                row += ';text-align:right;font-size:125%;'+elected+'">';
                row += '<abbr style="text-decoration:none;" title="'+tempcandidate.getAttribute('votes')+' votes">'+score+'%</abbr></td></tr>';
            }
            row += '</tbody>'
        }
        
        
        
        
        table += row
    }
    table += '</table>';
    return(table);
}

function toggler(item) {
    if (item.style.display == 'table-row-group') {
        item.style.display = 'none'
    } else {
        item.style.display = 'table-row-group'
    }
}

function PartyName(abbr) {
    switch(abbr) {
        case 'D': return('Democratic Party');
        case 'R': return('Republican Party');
        case 'MWP': return('Midwest Party');
        case 'MP': return('Majorero Party');
        case 'KMP': return('King\'s Movement Party');
        case 'J': return('Jewish Party');
        case 'F': return('Federalist');
        case 'DNV': return('DNV');
        case 'G': return('Green Party');
        case 'I': return('Independent');
        default: return('No Party Preference');
    }
}

function PartyColor(abbr) {
    switch(abbr) {
        case 'D': return('#3333FF');
        case 'R': return('#E81B23');
        case 'MWP': return('#CC8960');
        case 'MP': return('#BB3A7A');
        case 'KMP': return('#EFBD40');
        case 'J': return('#F092C4');
        case 'F': return('#000000');
        case 'DNV': return('#734815');
        case 'G': return('#00A95C');
        case 'I': return('gray');
        default: return('gainsboro');
    }
}