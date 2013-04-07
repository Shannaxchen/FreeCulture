var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var app = express();
var conn = anyDB.createConnection('sqlite3://freeculture.db');

//make db
conn.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, date INTEGER, body TEXT, linkto TEXT)');

//configuration
app.configure(function(){
	app.engine('html',engines.hogan); //tell express to run .html files through Hogan
	app.set('views',__dirname+'/templates'); //tell express where to find templates
	app.use(express.bodyParser());
  	app.use(express.cookieParser());
 	app.use(express.methodOverride());
  	app.use(express.session({
  		secret: 'some_secret_key',
  		store: express.session.MemoryStore({reapInterval: 60000 * 10})
		}));
  	app.use(app.router);
	app.use('/public',express.static(__dirname+'/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//route
app.get('/',function(request,response){
		/*var q = conn.query("SELECT DISTINCT room FROM messages WHERE time >= strftime('%s','now') - 300");
		var str='';
		q.on('row', function(row){
				str=str+'<p>Join this room: <a href="/'+row.room+'">'+row.room+'</a>'+'</p>';
			}).on('end',function(){
				response.render('index.html',{title:"Chatroom",extrainfo:str});
			});
		if (request.session.name==null)
			loggedin=false;*/
		response.render('homepage.html',{title:"Culture On The Cheap", posts:"hi"});
		});

app.get('/admin',function(request,response){

	});

app.listen(8080, function(){
  console.log("FreeCulture server listening on 8080");
});
