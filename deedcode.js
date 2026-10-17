/* DeedCode: tidy the address bar so visitors never see ".html" */
(function(){try{var p=location.pathname;if(/^https?:$/.test(location.protocol)&&/\.html$/.test(p)){var c=p.replace(/index\.html$/,'').replace(/\.html$/,'');history.replaceState(null,'',(c||'/')+location.search+location.hash)}}catch(e){}})();
