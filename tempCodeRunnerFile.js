app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000,chrome-extension://kopkidalhmggekpjknjijmjnhenggojm/');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
    next();
  });