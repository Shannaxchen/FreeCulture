var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var moment = require('moment');
var app = express();
var conn = anyDB.createConnection('sqlite3://freeculture.db');
var conn_admin = anyDB.createConnection('sqlite3://freeculture_admin.db');

//make db
conn.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT)');
conn_admin.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT)');

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

conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Architecture", "Architecture event", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130620", "20130625","2400","heythere this is the description hopefully this is long enough what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd h h what if its too longdsjfh h what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfdjashfkl djshfkldjashfkl dashfjdhaslfkjhdklsjhfdkjashflk dshfjahdlfkjhasdl  dashfjldjhlfkj hadjf khldkljshf hdjafkhl dkjshl dhfjkdhlfkjhd dfhjlaj djhfal djsjdhfkj djhfjkd eirjlk lsjfh hdsjfl khdljshfla hdjsahfldkls jahflkdjashf hjadhfldhaslf hadjsflhjasdhl f djfhlkjdshk dhfjdskfjhdj free and cheap things to do in NYC", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Art", "Art event", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130465","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Dance", "Dance event", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Design", "Andy Warhol", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Film", "Gone with the wind", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Food", "Kabob and Curry", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","heythere this is the description hopefully this is long enough what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd h h what if its too longdsjfh h what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfdjashfkl djshfkldjashfkl dashfjdhaslfkjhd heythere this is the description hopefully this is long enough what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd h h what if its too longdsjfh h what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfdjashfkl djshfkldjashfkl dashfjdhaslfkjhdk lsjhfdkjashflk dshfjahdlfkjhasdl  dashfjldjhlfkj hadjf khldkljshf hdjafkhl dkjshl klsjhfdkjashflk dshfjahdlfkjhasdl  dashfjldjhlfkj hadjf khldkljshf hdjafkhl dkjshl", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Fun", "Nothing", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["LectureTalk", "CS132 Lecture", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Music", "PSY", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',["Theater", "I dunno", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com"]).on('error',console.error);

//route
app.get('/',function(request,response){
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			console.log(modify_d)
			var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto FROM posts WHERE enddate >= "+modify_d+" ORDER BY startdate DESC";
			var q = conn.query(sql);
			var post_html='';
			console.log(q);
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"' target='"+row.title+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "<h4>" + row.time + "</h4>";
					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){
					response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html});
			});

		});


app.get('/submit',function(request,response){
		response.render('submit.html',{title:"Submit A Post!"});
});

app.post('/submit/form',function(request,response){
		//DO MORE THINGS TO HANDLE THE POST SUBMISSION
		response.render('homepage.html',{title:"Your post has been submitted!",posts:"<p>Your event has been submitted! We are reviewing it right now.</p>"});
		});

app.get('/search',function(request,response){
		response.render('search.html',{title:"Search"});
});

app.post('/search',function(request,response){
		//DO MORE THINGS TO lace the sql query together from the request
		var keyword = request.body.textsearch;
		var post_html = '';
		var today = new Date();
		var modify_d = moment(today).format('YYYYMMDD')
		var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto FROM posts WHERE enddate >= "+modify_d+" AND (title LIKE '%"+keyword+"%' OR body like '%"+keyword+"%') ORDER BY startdate DESC";
		var q = conn.query(sql,[]);
		q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "<h4>" + row.time + "</h4>";
					post_html += "</a>";
					post_html += "</div>";
		}).on('end',function() { 
			if (post_html === "") {
				post_html = "<div class='noresult'><p><b>No results found.</p></div>";
			}
			response.render('homepage.html',{title:"Search Results", posts:post_html});
		});
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

app.get('/:Category',function(request,response){
		var cat;
		var isDate = false;
		for (var i = 0; i < categoryIDS.length; i++){
			if (categoryIDS[i]==request.params.Category){
				cat = request.params.Category;
			}
		}
		if (cat == null){
			if (request.params.Category.length == 8){
				cat = request.params.Category;
				isDate = true;
			}
		}
		if (cat == null){
			response.render('error.html',{title:"Error"});
		}
		else {
			//format of the date will be 6 digits: YearMonthDay
			//so keep this in mind for the "SUBMIT" option
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			if (isDate){
				var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto FROM posts WHERE startdate<=$1 AND enddate >=$1 ORDER BY startdate DESC";
			}
			else{
				var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto FROM posts WHERE category=$1 AND enddate > "+modify_d+" ORDER BY startdate DESC";
			}
			var q = conn.query(sql,[cat]);
			var post_html='';
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "<h4>" + row.time + "</h4>";
					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){
					response.render('homepage.html',{title:cat, posts:post_html});
			});
		}
});

app.post('/submit/submit', function(request, response){
    // post everything to the database, then...
    response.redirect('/');


    var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

    var category = request.body.category;
    var title = request.body.title;
    var image = request.body.image;
    
    var startmonth = monthtext.indexOf(request.body.startmonth);
    var startday = request.body.startday;

console.log(startmonth + " " + startday);

    if(startmonth < 10){
    	startmonth = '0' + startmonth;
    }
    if(startday < 10){
    	startday = '0' + startday;
    }
    var startdate = request.body.startyear + request.body.startmonth + request.body.startday; 

    var endmonth = monthtext.indexOf(request.body.endmonth);
    var endday = request.body.endday;

    if(endmonth < 10){
    	endmonth = '0' + endmonth;
    }
    if(endday < 10){
    	endday = '0' + endday;
    }
    var enddate = request.body.endyear + request.body.endmonth + request.body.endday; 
    var startdate = "20130520"
    var enddate = "20130520"
    var time = "2400";
    var body = request.body.description;
    var linkto = request.body.link;

    var sql = 'INSERT INTO posts (category,title,image,startdate,enddate,time,body,linkto) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';

    var q = conn_admin.query(sql, [category, title, image, startdate, enddate, time, body, linkto]);


    q.on('error', console.error);
});

app.get('/admin',function(request,response){
  /* if(!request.session.password){

    }

    if(request.session.password){
	   //Read values from your form
	    var password = request.param('password');

		//marks that they aren't british, mark it again or remove that session cookie

	    //Show the list of documents or an error,
	    //depending on whether they're British.
	    request.session.username = username;
	    request.session.password = password;
	    request.session.brit = brit;

	var today = new Date();
	var modify_d = moment(today).format('YYYYMMDD')
	var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto FROM posts WHERE enddate >= "+modify_d+" ORDER BY startdate DESC";
	var q = conn_admin.query(sql);
	var post_html='';
	console.log(q);
	q.on('row', function(row){
			post_html += "<div class ='post'>";
			post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
			post_html += "<p>" + row.body + "</p>";
			post_html += "<h1>" + row.category + "</h1>";
			post_html += "<h2>" + row.title + "</h2>";
			post_html += "<h3>" + row.startdate + "</h3>";
			post_html += "<h3>" + row.enddate + "</h3>";
			post_html += "<h4>" + row.time + "</h4>";
			post_html += "</div>"
		}).on('end',function(){
			response.render('admin.html',{title:"Culture on The Cheap", posts:post_html});
	});

    }
    else {
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			console.log(modify_d)
			var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto FROM posts WHERE enddate >= "+modify_d+" ORDER BY startdate DESC";
			var q = conn.query(sql);
			var post_html='';
			console.log(q);
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<p>" + row.body + "</p>";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "<h4>" + row.time + "</h4>";
					post_html += "</div>"
				}).on('end',function(){
					response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html});
			});


    }*/


});

app.listen(8080, function(){
  console.log("FreeCulture server listening on 8080");
});
