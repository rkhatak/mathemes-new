if((window.location.host === 'www.spicethainyc.com')||(window.location.host === 'spicethainyc.com')) {
    window.analyticCode = 'UA-101085502-1';
    window.domainName = 'www.spicethainyc.com';
    window.ENV = 'live';
} else if(window.location.host === 'spice.munchado.in') {
    window.analyticCode = 'UA-101085502-2';
    window.domainName = 'spice.munchado.in';
    window.ENV = 'qc';
}else {
    window.analyticCode = 'UA-101085502-2';
    window.domainName = 'local';
    window.ENV = 'local';
}  
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', window.analyticCode, window.domainName);
ga('require', 'displayfeatures');
ga('send', 'pageview');    
    // window.addEventListener('load', function(e) {
    //     window.applicationCache.addEventListener('updateready', function(e) {
    //       if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
    //           window.location.reload(true);
    //       }
    //     }, false);
    //   }, false);