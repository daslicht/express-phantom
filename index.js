module.exports = function phantom(path, options){
  var child_process, exec, useragent;
  child_process = require("child_process");
  exec = child_process.exec;
  useragent = require('useragent');



  return function phantom(req, res, next){
    var ua, fullUrl, cacheKey;
    ua = useragent.is(req.headers['user-agent']);
    console.log(ua);
    if (ua.webkit || ua.opera || ua.ie || ua.chrome || ua.safari || ua.mobile_safari || ua.firefox) {
      return next();
    }
    fullUrl = req.protocol + "://" + req.get('host') + req.url;
    cacheKey = "cache-url-" + fullUrl;
    // if (params.redisClient) {
    //   params.redisClient.get(cacheKey, function(error, result){
    //     if (result) {
    //       return res.send(200, result);
    //     }
    //   });
    // }
    return exec("node " + __dirname + "/render.js " + fullUrl, function(error, stdout, stderr){
      if (error || stderr) {
        return res.send(500);
      }
      // if (params.redisClient) {
      //   params.redisClient.set(cacheKey, stdout);
      //   params.redisClient.expire(cacheKey, params.TTL || 3600);
      // }
      return res.send(200, stdout);
    });
  };
};

