if(window.location.host === 'www.gammeeok.nyc') {
        window.analyticCode = 'UA-99007569-2';
        window.domainName = 'www.gammeeok.nyc';
        window.ENV = 'live';
} else if(window.location.host === 'gameeok.munchado.in') {
    window.analyticCode = 'UA-99007569-3';
    window.domainName = 'gameeok.munchado.in';
    window.ENV = 'qc';
}else {
    window.analyticCode = 'UA-99007569-1';
    window.domainName = 'local';
       window.ENV = 'local';
} 
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', window.analyticCode, 'auto');
ga('require', 'displayfeatures');
ga('send', 'pageview');
ga('require', 'ec');