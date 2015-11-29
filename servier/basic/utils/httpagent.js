// agent server
var http = require('http'),
HttpProxyAgent = require('http-proxy-agent'),
url = require('url'),
extend = require('./extend');

var server;
var doRequest = function(req, res){
    var _path = url.parse(req.url).pathname
    var _keys = Object.keys(this.config);
    var match = false;
    var me = this;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    console.log('request successfully proxied!' + '\n' + 'url: '+ req.url + '\n' + JSON.stringify(req.headers, true, 2));
    if(!_keys.length){
        var json = {code:'E00001',message:'no match'};
        res.write(JSON.stringify(json));
        return res.end();
    }
    _keys.forEach(function(k){
        if(_path===k){
            match = true;
            var _conf = me.config[k];
            var _proxy = _conf['proxy_ip'];
            console.log('using proxy server %j', _proxy);
            var endpoint = _conf['proxy_url'];
            console.log('attempting to GET %j', endpoint);
            var _opts = url.parse(endpoint);
            var agent = new HttpProxyAgent(_proxy);
            var str = '';
            _opts.agent = agent;
            if(_conf['user_agent']){
                _opts.headers = {
                    "User-Agent":_conf['user_agent']
                };
            }
            var reqcallback = function(response) {
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () { 
                    res.write(str);
                    res.end();
                    // your code here if you want to use the results !
                });
            } 
            var req = http.request(_opts, reqcallback).end();
        }
    });
    if(!match){
        var json = {code:'E00001',message:'no match'};
        res.write(JSON.stringify(json));
        res.end();
    }
    
};

module.exports = {
    createServer: function(port,config){
        port = port || 9000;
        config = config || {};
        this.config = config;
        server = http.createServer(doRequest.bind(this)).listen(port);
    },
    closeServer: function(){
        if(server){
            server.close();
        }
    },
    setConfig: function(config){
        config = config || {};
        extend(this.config,config); 
        extend(this.config,config); 
    }
}; 