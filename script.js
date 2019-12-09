function footer() {
	var html = '<footer>';
    html += '<address>Website made by <a style="color:darkslategray" href="https://discordapp.com/channels/@me/247308028649537536">Julio974</a></address> See on <a style="color:darkslategray" href="https://github.com/LME2/lme2.github.io">Github</a> &bull; <a style="color:darkslategray" href="https://lme2.github.io/sitemap.html">Sitemap</a> &bull; <a style="color:darkslategray;" href="https://github.com/LME2/lme2.github.io/issues">Report bugs or suggest features</a>'
    html += '</footer>';
	document.write(html);
}

function navbar() {
    var html = '<div class="navbar">';
    html += '<a href="/index.html" class="active">Homepage</a>';
    html += '<a href="/government.html">Government</a>';
    html += '<a href="/elections/Dec19.html">Elections</a>';
    html += '<a href="/legislation.html">Laws</a>';
    html += '<a href="/rankings.html">Politicians</a>';
    html += '<a href="/parties.html">Parties</a>';
    html += '<a href="https://discord.gg/D33wqMs" class="right">Join</a>';
    html += '</div>';
    document.write(html)
}