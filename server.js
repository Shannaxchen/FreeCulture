var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var moment = require('moment');
var app = express();
var conn = anyDB.createConnection('sqlite3://freeculture.db');
var conn_admin = anyDB.createConnection('sqlite3://freeculture_admin.db');
var conn_trash = anyDB.createConnection('sqlite3://freeculture_trash.db');

var email = "john_tran@brown.edu";

//make db
conn.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT, price INTEGER, postdate INTEGER, clickcount INTEGER)');
conn_admin.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT postid TEXT, price INTEGER)');
conn_trash.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT postid TEXT, price INTEGER)');

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

function convertTime(time){
	if (time < 1200){
		if (time < 100){
			return "12:" + time.toString().substring(2) + " AM";
		}
		else{
			return time.toString().substring(0,2) + ":" + time.toString().substring(2) + " AM";
		}
	}
	else{
		if (time < 1300){
			return "12:" + time.toString().substring(2) + " PM";
		}
		else{
			return (time - 1200).toString().substring(0,2) + ":" + time.toString().substring(2) + " PM";
		}
		
	}
}

//all possible category IDs.
var categoryIDS = ["Architecture","Art","Dance","Design","Film","Food","Fun","LectureTalk","Music","Theater","Tours"];

conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Architecture", "Architecture event", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130620", "20130625","2400","heythere this is the description hopefully this is long enough what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd h h what if its too longdsjfh h what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfdjashfkl djshfkldjashfkl dashfjdhaslfkjhdklsjhfdkjashflk dshfjahdlfkjhasdl  dashfjldjhlfkj hadjf khldkljshf hdjafkhl dkjshl dhfjkdhlfkjhd dfhjlaj djhfal djsjdhfkj djhfjkd eirjlk lsjfh hdsjfl khdljshfla hdjsahfldkls jahflkdjashf hjadhfldhaslf hadjsflhjasdhl f djfhlkjdshk dhfjdskfjhdj free and cheap things to do in NYC", "google.com",0]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Art", "Art event", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130465","2400","hey", "google.com",1]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Dance", "Dance event", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",2]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Design", "Andy Warhol", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",3]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Film", "Gone with the wind", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",4]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Food", "Kabob and Curry", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","heythere this is the description hopefully this is long enough what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd h h what if its too longdsjfh h what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfdjashfkl djshfkldjashfkl dashfjdhaslfkjhd heythere this is the description hopefully this is long enough what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd h h what if its too longdsjfh h what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfd what if its too longdsjfh ladhsfkj dhas fjhdkj ashflkdj ashf lkdhjasf lkjdhaskl fjhdkjhdkjashfdjashfkl djshfkldjashfkl dashfjdhaslfkjhdk lsjhfdkjashflk dshfjahdlfkjhasdl  dashfjldjhlfkj hadjf khldkljshf hdjafkhl dkjshl klsjhfdkjashflk dshfjahdlfkjhasdl  dashfjldjhlfkj hadjf khldkljshf hdjafkhl dkjshl", "google.com",0]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Fun", "Nothing", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",3]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["LectureTalk", "CS132 Lecture", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",6]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Music", "PSY", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",2]).on('error',console.error);
conn.query('INSERT INTO posts (category,title,image,startdate,enddate,time, body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',["Theater", "I dunno", "http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg", "20130621", "20130625","2400","hey", "google.com",10]).on('error',console.error);

//route
app.get('/',function(request,response){
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE enddate >= "+modify_d+" ORDER BY startdate DESC";
			var q = conn.query(sql);
			var post_html='';
			console.log(q);
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"' target='"+row.title+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					if('email' in request.session && request.session.email.localeCompare(email) == 0){
						post_html += "<div class ='admin'><a href='edit/" + row.id +"'>Edit</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/approve/" + row.id +"'>Approve</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/reject/" + row.id +  "'>Reject</a></div>";
					}	
					post_html += "<h4>" + convertTime(row.time) + "</h4>";
					if (row.price == 0){
						post_html += "<h4> Free </h4>";
					}
					else{
						post_html += "<h4>$" + row.price + "</h4>";
					}
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate.toString().substring(4,6) + "/" + row.startdate.toString().substring(6) + "/" + row.startdate.toString().substring(0,4) + " - ";					post_html += row.enddate.toString().substring(4,6) + "/" + row.enddate.toString().substring(6) + "/" + row.enddate.toString().substring(0,4) + "</h3>";					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){

					response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html,preview:getPreviewHTML(request)});
			});

		});



app.post('/auth/login', function(request, response){
    var assertion, requestBody, requestHeaders;

    assertion = request.body.assertion;
    requestBody = JSON.stringify({
      assertion: assertion,
      audience: process.env.AUDIENCE || 'localhost:' + 8080
    });
    requestHeaders = {
      host: 'verifier.login.persona.org',
      path: '/verify',
      method: 'POST',
      headers: {
        'Content-Length': requestBody.length,
        'Content-Type': 'application/json'
      }
    };
    makeRequest(requestHeaders, requestBody, function(responseBody) {
      var res;

      res = JSON.parse(responseBody);
      if (res.status === 'okay' && res.email.localeCompare(email) == 0) {
        request.session.email = res.email;
	response.send('yes');
      } else {
        request.session = null;
        response.send('no');
        return console.log(res);
      }
    }); 
});

app.post('/auth/logout', function(request, response){
    request.session.email = '';
    return response.send('done');
});

app.get('/submit',function(request,response){
		response.render('submit.html',{title:"Submit A Post!"});
});

app.post('/submit/form',function(request,response){
		//DO MORE THINGS TO HANDLE THE POST SUBMISSION
		response.render('homepage.html',{title:"Your post has been submitted!",posts:"<p>Your event has been submitted! We are reviewing it right now.</p>"});
		});

app.post('/search',function(request,response){
		//DO MORE THINGS TO lace the sql query together from the request
		var keyword = request.body.textsearch;
		var post_html = '';
		var today = new Date();
		var modify_d = moment(today).format('YYYYMMDD')
		var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE enddate >= "+modify_d+" AND (title LIKE '%"+keyword+"%' OR body like '%"+keyword+"%') ORDER BY startdate DESC";
		var q = conn.query(sql,[]);
		q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					post_html += "<h4>" + convertTime(row.time) + "</h4>";
					if (row.price == 0){
						post_html += "<h4> Free </h4>";
					}
					else{
						post_html += "<h4>$" + row.price + "</h4>";
					}
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate.toString().substring(4,6) + "/" + row.startdate.toString().substring(6) + "/" + row.startdate.toString().substring(0,4) + " - ";
					post_html += row.enddate.toString().substring(4,6) + "/" + row.enddate.toString().substring(6) + "/" + row.enddate.toString().substring(0,4) + "</h3>";
					post_html += "</a>";
					post_html += "</div>";
		}).on('end',function() { 
			if (post_html === "") {
				post_html = "<div class='noresult'><p><b>No results found.</p></div>";
			}

			response.render('results.html',{title:"Search Results", posts:post_html,preview:getPreviewHTML(request)});
		});
});

app.get('/mp',function(request,response){
		//display them by popularity
		var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price,clickcount FROM posts WHERE enddate >= "+modify_d+" ORDER BY clickcount DESC";
			var q = conn.query(sql);
			var post_html='';
			console.log(q);
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"' target='"+row.title+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					if('email' in request.session && request.session.email.localeCompare(email) == 0){
						post_html += "<div class ='admin'><a href='edit/" + row.id +"'>Edit</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/approve/" + row.id +"'>Approve</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/reject/" + row.id +  "'>Reject</a></div>";
					}	
					post_html += "<h4>" + convertTime(row.time) + "</h4>";
					if (row.price == 0){
						post_html += "<h4> Free </h4>";
					}
					else{
						post_html += "<h4>$" + row.price + "</h4>";
					}
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){

					response.render('homepage.html',{title:"Culture on The Cheap : Popularity", posts:post_html,preview:getPreviewHTML(request)});
			});
});

app.get('/l2h',function(request,response){
			//sort by low to high prices
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE enddate >= "+modify_d+" ORDER BY price ASC";
			var q = conn.query(sql);
			var post_html='';
			console.log(q);
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"' target='"+row.title+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					if('email' in request.session && request.session.email.localeCompare(email) == 0){
						post_html += "<div class ='admin'><a href='edit/" + row.id +"'>Edit</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/approve/" + row.id +"'>Approve</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/reject/" + row.id +  "'>Reject</a></div>";
					}	
					post_html += "<h4>" + convertTime(row.time) + "</h4>";
					if (row.price == 0){
						post_html += "<h4> Free </h4>";
					}
					else{
						post_html += "<h4>$" + row.price + "</h4>";
					}
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){

					response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html,preview:getPreviewHTML(request)});
			});
});

app.get('/pd',function(request,response){
			//sort by the latest posts
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price,postdate FROM posts WHERE enddate >= "+modify_d+" ORDER BY postdate DESC";
			var q = conn.query(sql);
			var post_html='';
			console.log(q);
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"' target='"+row.title+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					if('email' in request.session && request.session.email.localeCompare(email) == 0){
						post_html += "<div class ='admin'><a href='edit/" + row.id +"'>Edit</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/approve/" + row.id +"'>Approve</a>";
						post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/reject/" + row.id +  "'>Reject</a></div>";
					}	
					post_html += "<h4>" + convertTime(row.time) + "</h4>";
					if (row.price == 0){
						post_html += "<h4> Free </h4>";
					}
					else{
						post_html += "<h4>$" + row.price + "</h4>";
					}
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate + "</h3>";
					post_html += "<h3>" + row.enddate + "</h3>";
					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){

					response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html,preview:getPreviewHTML(request)});
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

app.get('/login',function(request,response){
		response.render('login.html',{title:"Login"});
});

app.get('/edit/:postid',function(request,response){
		var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE id == "+request.params.postid+" ORDER BY startdate DESC";
		var q = conn_admin.query(sql);
		var item = {};

		q.on('row', function(row){
			item = {category: row.category, title: row.title, image: row.image, startdate: row.startdate.toString(), enddate: row.enddate.toString(), time: row.time.toString(), body: row.body, linkto: row.linkto, price:row.price};
			}).on('end',function(){
			var find = ' ';
			var re = new RegExp(find, 'g');

			console.log(item);
			response.render('admin/edit.html',{title:"Edit A Post!", postid:request.params.postid, eventtitle:item.title.replace(re, "&nbsp;"), eventcategory:item.category, eventbody: item.body, eventimage: item.image.replace(re, "&nbsp;"), eventlinkto: item.linkto, eventstartdate: item.startdate, eventenddate: item.enddate});
		});
});


app.post('/edit/form',function(request,response){
    		response.redirect('/');
	});

app.get('/approve/:postid',function(request,response){
	var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE id == "+request.params.postid + " ORDER BY startdate DESC";
	var q = conn_admin.query(sql);

	var sql2 = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q2 = conn_admin.query(sql2);
	q.on('row', function(row){
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD');
			var sql = 'INSERT INTO posts (category,title,image,startdate,enddate,time,body,linkto,price,postdate,clickcount) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';

			var q = conn.query(sql, [row.category, row.title, row.image, row.startdate, row.enddate, row.time, row.body, row.linkto,row.price,modify_d,0]);
			q.on('error', console.error);

		}).on('end',function(){
			response.redirect('/');
	});
});

app.get('/reject/:postid',function(request,response){
	var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE id == "+request.params.postid + " ORDER BY startdate DESC";
	var q = conn_admin.query(sql);

	var sql2 = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q2 = conn_admin.query(sql2);

	q.on('row', function(row){

			var sql = 'INSERT INTO posts (category,title,image,startdate,enddate,time,body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';

			var q = conn_trash.query(sql, [row.category, row.title, row.image, row.startdate, row.enddate, row.time, row.body, row.linkto,row.price]);
			q.on('error', console.error);

		}).on('end',function(){
			response.redirect('/');
	});
});

app.get('/restore/:postid',function(request,response){
	var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE id == "+request.params.postid + " ORDER BY startdate DESC";
	var q = conn_trash.query(sql);

	var sql2 = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q2 = conn_trash.query(sql2);

	q.on('row', function(row){

			var sql = 'INSERT INTO posts (category,title,image,startdate,enddate,time,body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';

			var q = conn_admin.query(sql, [row.category, row.title, row.image, row.startdate, row.enddate, row.time, row.body, row.linkto, row.price]);
			q.on('error', console.error);

		}).on('end',function(){
			response.redirect('/');
	});
});

app.get('/delete/:postid',function(request,response){
	var sql = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q = conn_trash.query(sql);
	response.redirect('/');
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
				var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE startdate<=$1 AND enddate >=$1 ORDER BY startdate DESC";
			}
			else{
				var sql = "SELECT DISTINCT category,title,image,startdate,enddate,time,body,linkto,price FROM posts WHERE category=$1 AND enddate > "+modify_d+" ORDER BY startdate DESC";
			}
			var q = conn.query(sql,[cat]);
			var post_html='';
			q.on('row', function(row){
					post_html += "<div class ='post'>";
					post_html += "<a href = 'http://"+row.linkto+"'>";
					post_html += "<div class ='corner'></div>";
					post_html += "<div class ='hover'>";
					post_html += "<h2>Event Description</h2>";
					post_html += "<h4>" + convertTime(row.time) + "</h4>";
					if (row.price == 0){
						post_html += "<h4> Free </h4>";
					}
					else{
						post_html += "<h4>$" + row.price + "</h4>";
					}
					post_html += "<div class ='description'>";
					post_html += "<p>" + row.body + "</p>";
					post_html += "</div>";
					post_html += "</div>";
					post_html += "<img src =\"" + row.image + "\"" + " onerror=\"this.src='http://d2tq98mqfjyz2l.cloudfront.net/image_cache/1355201898857930.jpg'\" >";
					post_html += "<h1>" + row.category + "</h1>";
					post_html += "<h2>" + row.title + "</h2>";
					post_html += "<h3>" + row.startdate.toString().substring(4,6) + "/" + row.startdate.toString().substring(6) + "/" + row.startdate.toString().substring(0,4) + " - ";					post_html += row.enddate.toString().substring(4,6) + "/" + row.enddate.toString().substring(6) + "/" + row.enddate.toString().substring(0,4) + "</h3>";					post_html += "</a>";
					post_html += "</div>";
				}).on('end',function(){
					response.render('results.html',{title:cat, posts:post_html,preview:getPreviewHTML(request)});
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
    var price = request.body.price;
    
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

    var sql = 'INSERT INTO posts (category,title,image,startdate,enddate,time,body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';

    var q = conn_admin.query(sql, [category, title, image, startdate, enddate, time, body, linkto, price]);

    q.on('error', console.error);
});


app.post('/edit/submit', function(request, response){
    // post everything to the database, then...
    response.redirect('/');

    var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

    var category = request.body.category;
    var title = request.body.title;
    var image = request.body.image;
    var price = request.body.price;
    
    var startmonth = monthtext.indexOf(request.body.startmonth);
    var startday = request.body.startday;

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

    var postid = request.body.postid;


    var sql = 'INSERT INTO posts (category,title,image,startdate,enddate,time,body,linkto,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)';

    var q = conn_admin.query(sql, [category, title, image, startdate, enddate, time, body, linkto, price]);

    var sql2 = "DELETE FROM posts WHERE id == " + postid;
    var q2 = conn_admin.query(sql2);

    q.on('error', console.error);
});

app.listen(3000, function(){
  console.log("FreeCulture server listening on 3000");
});

function generatePostIdentifier() {
    // make a list of legal characters
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    var result = '';
    for (var i = 0; i < 15; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}

function getPreviewHTML(request){

	var preview_html = '';

	console.log(request.session);

	if('email' in request.session && request.session.email.localeCompare(email) == 0){
		preview_html += "<div id='sort_nav_container'>";
		preview_html +=	"<ul id='sort_nav'>";
		preview_html += "<li id='sort_by'>Preview: </li>";
		preview_html += "<li id='price_low_high'><a href='#'>Unapproved Posts</a></li>";
		preview_html +=	"<li id='event_date'><a href='#'>Approved Posts</a></li>";
		preview_html += "<li id='event_date'><a href='#'>Rejected Posts</a></li>";
		preview_html += "<li id='most_popular'><a href='#'>All Posts</a></li>";
		preview_html += "</ul></div>";
	}
	console.log(preview_html);
	return preview_html;

}


var  https = require('https');

function makeRequest(headers, body, callback) {
    var vreq;

    vreq = https.request(headers, handleResponse(callback));
    return vreq.write(body);
  };

  function handleResponse(callback) {
    return function(vres) {
      var responseBody;

      responseBody = '';
      vres.on('data', function(chunk) {
        return responseBody += chunk;
      });
      return vres.on('end', function() {
        return callback(responseBody);
      });
    };
  };
