var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var moment = require('moment');
var app = express();
var conn = anyDB.createConnection('sqlite3://freeculture.db');

//make db
conn.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, image TEXT, date INTEGER, body TEXT, linkto TEXT)');

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

//all possible category IDs.
var categoryIDS = ["Architecture","Art","Dance","Design","Film","Food","Fun","LectureTalk","Music","Theater","Tours"];

//route
app.get('/',function(request,response){
			var sql = "SELECT DISTINCT category,title,image,date,body,linkto FROM posts WHERE date > "+modify_d+" ORDER BY date DESC";
			var q = conn.query(sql);
			var post_html='';
			q.on('row', function(row){
					post_html += "<div class ='post'>"
					post_html += "<img src =" + row.image + "/>"
					post_html += "<p>" + row.body + "</p>"
					post_html += "<h1>" + row.category + "</h1>"
					post_html += "<h2>" + row.title + "</h2>"
					post_html += "<h3>" + row.date + "</h3>"
					post_html += "</div>"
				}).on('end',function(){
					response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html});
			});
		});

app.get('/:Category',function(request,response){
		var cat;
		for (var i = 0; i < categoryIDS.length; i++){
			if (categoryIDS[i]==request.params.Category){
				cat = request.params.Category;
			}
		}
		if (cat == null){
			response.render('error.html',{title:"Error"});
		}
		else{
			//format of the date will be 6 digits: YearMonthDay
			//so keep this in mind for the "SUBMIT" option
			var today = new Date();
			var d = today.getDate();
			var modify_d = moment(d).format('YYMMDD')
			var sql = "SELECT DISTINCT category,title,image,date,body,linkto FROM posts WHERE category=$1 AND date > "+modify_d+" ORDER BY date DESC";
			var q = conn.query(sql,[cat]);
			var post_html='';
			q.on('row', function(row){
					post_html += "<div class ='post'>"
					post_html += "<img src =" + row.image + "/>"
					post_html += "<p>" + row.body + "</p>"
					post_html += "<h1>" + row.category + "</h1>"
					post_html += "<h2>" + row.title + "</h2>"
					post_html += "<h3>" + row.date + "</h3>"
					post_html += "</div>"
				}).on('end',function(){
					response.render('homepage.html',{title:cat, posts:post_html});
			});
		}
});

app.get('/about',function(request,response){
		response.render('about.html',{title:"About Us"});
});

app.get('/contact',function(request,response){
		response.render('contact.html',{title:"Contact Us"});
});

app.get('/about.html',function(request,response){
		response.render('about.html',{title:"About Us"});
});

app.get('/contact.html',function(request,response){
		response.render('contact.html',{title:"Contact Us"});
});

app.get('/admin',function(request,response){

	});

app.listen(8080, function(){
  console.log("FreeCulture server listening on 8080");
});
