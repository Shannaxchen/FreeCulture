var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
var moment = require('moment');


var path = require('path');
var fs = require('fs');

var app = express();
var XMLHttpRequest = require('w3c-xmlhttprequest');

var conn = anyDB.createConnection('sqlite3://freeculture.db');
var conn_admin = anyDB.createConnection('sqlite3://freeculture_admin.db');
var conn_trash = anyDB.createConnection('sqlite3://freeculture_trash.db');

var IMAGEFILEFORMATS = [".gif", ".jpg", ".jpeg", ".bmp", ".png"];

var PREVIEW = {
  APPROVED : {value: 0}, 
  REJECTED: {value: 1}, 
  UNAPPROVED : {value: 2}
};

var ORDER = {
  L2H : {value: 0, sql: " ORDER BY price ASC"}, 
  ED : {value: 1, sql: " ORDER BY startdate ASC"}, 
  PD : {value: 2, sql: " ORDER BY postdate DESC"},
};

var email = "dglassdes@aol.com";
var hostname = "localhost:" //
var PORT = 3000

// Read the file and print its contents.

var DEFAULTIMAGE = "";
var DEFAULTADIMAGE = "";
var DEFAULTHEADERIMAGE = "";

var adlink = "";
var aboutus = "";
var contact = "";
var description = "";

//all possible category IDs.
var categoryIDS = [];


try{
	var splits = fs.readFileSync('savedata.txt').toString().split("\n");
	console.log(splits);
	DEFAULTIMAGE = splits[1].replace(/(\r\n|\n|\r)/gm,"");
	DEFAULTADIMAGE = splits[3].replace(/(\r\n|\n|\r)/gm,"");
	DEFAULTHEADERIMAGE = splits[5].replace(/(\r\n|\n|\r)/gm,"");

	adlink = splits[7].replace(/(\r\n|\n|\r)/gm,"");

	var aboutus_index = splits.indexOf("ABOUTUS\r");
	var contact_index = splits.indexOf("CONTACT\r");
	var description_index = splits.indexOf("DESCRIPTION\r");
	var categories_index = splits.indexOf("CATEGORIES\r");	

	for(var i = aboutus_index +1; i < contact_index; i++){
		aboutus += splits[i];
	}

	for(var i = contact_index +1; i < description_index; i++){
		contact += splits[i];
	}

	for(var i = description_index +1; i < categories_index; i++){
		description += splits[i];
	}
	
	for(var i = categories_index +1; i < splits.length; i++){
		if(splits[i].length != 0 && splits[i] != "\r\n" && splits[i] != "\n" && splits[i] != "\r"){
			categoryIDS.push(splits[i].replace("\r", ""));
		}
	}

} catch(e){
console.log(e);
	DEFAULTIMAGE = "../public/images/default.jpg";
	DEFAULTADIMAGE = "../public/images/Tile Ad.png";
	DEFAULTHEADERIMAGE = "../public/images/corner_ad.png";
	adlink = "http://cs.brown.edu/courses/csci1320/";
	aboutus = "	We are New York City enthusiasts who are always surprised by the constant stream of new and exciting things to discover throughout the city, and not all of them require a lot of money." + 
				  "Culture on the Cheap is a guide to free and cheap cultural events ranging from art and music shows to performances, talks, walks, food and more. " + 
				  "We curate this bulletin board based on what looks interesting to us, but it goes without saying that we cannot personally attend all that is listed.<br /><br />" +
				  "If you would like to submit an event, please send a one- or two-sentence description with a link that includes all event information (date/time/location/cost) and a compelling image. " +
				  "We cannot include all submissions, but will look at them all and post those that fit in well with Culture on the Cheap.<br /><br />" +
				  "Web Design/Development: <a href='mailto:jqtran@cs.brown.edu'>John Tran</a> || <a href='mailto:christopher.m.piette@gmail.com'>Chris Piette</a> || <a href = 'mailto:annaliasunderland@gmail.com'> Annalia Sunderland </a> || <a href = 'mailto:shannaxchen@gmail.com'>Shanna Chen </a> || <a href = 'mailto:hyoju_lim@brown.edu'>Hyoju Lim </a>";

	contact = "You can follow Culture on the Cheap (COTC) on <a href = 'http://twitter.com/cultureonthecheap'>Twitter</a> or like us on <a href = 'http://facebook.com/cultureonthecheap'>Facebook</a>."
	description = "FREE & CHEAP Things to Do in NYC During the Recession and Beyond... Art, Music, Theater, Film, Dance, Food, Lectures, Tours and more!";
	categoryIDS = ["Architecture","Art","Dance","Design","Film","Food","Fun","LectureTalk","Music","Theater","Tours"];
}

var defaultimage = DEFAULTIMAGE;
var defaultadimage = DEFAULTADIMAGE;
var defaultheaderimage = DEFAULTHEADERIMAGE;
//make db
conn.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, category2 TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT, price INTEGER, postdate INTEGER, adpos INTEGER)');
conn_admin.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, category2 TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT, price INTEGER, postdate INTEGER, adpos INTEGER)');
conn_trash.query('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, category2 TEXT, title TEXT, image TEXT, startdate INTEGER, enddate INTEGER, time INTEGER, body TEXT, linkto TEXT, price INTEGER, postdate INTEGER, adpos INTEGER)');

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
	app.use('/public/images',express.static(__dirname+'/public/images'));
	app.use('/public/images/uploads',express.static(__dirname+'/public/images/uploads/ads'));
	app.use('/public/images/uploads/ads',express.static(__dirname+'/public/images/uploads/ads'));

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});



//route

app.get('/home',function(request,response){
	request.session.category = "";
	response.redirect('/');
});

app.get('/',function(request,response){
	checkSession(request);

	var today = new Date();
	var modify_d = moment(today).format('YYYYMMDD')
	var sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos FROM posts WHERE enddate >= "+modify_d+request.session.order.sql;

	var q;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q = conn.query(sql);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q = conn_admin.query(sql);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q = conn_trash.query(sql);
	}
	var post_html='';

	var htmls = [];
	var adhtmls = [];
	q.on('row', function(row){
			post_html = generatePostHTML(request, row);
			var isAd = false; //let's figure out whether this is an ad or not

			if(row.category.localeCompare("Advertisement") == 0 || (row.category2 && row.category2.localeCompare("Advertisement") == 0)){
				isAd = true;
			}
			if(isAd){
				adhtmls.push({html: post_html, adpos: row.adpos});
			}
			else{
				htmls.push(post_html);
			}
		}).on('end',function(){
			post_html = "";

			adhtmls.sort(function(a,b){return a.adpos-b.adpos});
			for(var i = 0; i < adhtmls.length; i++){
				htmls.splice(adhtmls[i].adpos - 1, 0, adhtmls[i].html);	
			}


			for(var i = 0; i < htmls.length; i++){
				post_html += htmls[i];
			}
			response.render('homepage.html',{title:"Culture on The Cheap", posts:post_html,preview:getPreviewHTML(request), description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML(), headerimage: defaultheaderimage});
	});

});

app.get('/sitemap.xml',function(request,response){
	var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"><!-- created with Free Online Sitemap Generator www.xml-sitemaps.com --><url><loc>http://www.cultureonthecheap.com/</loc></url><url><loc>http://www.cultureonthecheap.com/submit</loc></url><url><loc>http://www.cultureonthecheap.com/Architecture</loc></url><url><loc>http://www.cultureonthecheap.com/Art</loc></url><url><loc>http://www.cultureonthecheap.com/Dance</loc></url><url><loc>http://www.cultureonthecheap.com/Design</loc></url><url><loc>http://www.cultureonthecheap.com/Film</loc></url><url><loc>http://www.cultureonthecheap.com/Food</loc></url><url><loc>http://www.cultureonthecheap.com/Fun</loc></url><url><loc>http://www.cultureonthecheap.com/LectureTalk</loc></url><url><loc>http://www.cultureonthecheap.com/Music</loc></url><url><loc>http://www.cultureonthecheap.com/Theater</loc></url><url><loc>http://www.cultureonthecheap.com/Tours</loc></url></urlset>';
	response.header('Content-Type','text/xml');
	response.send(xml);
});

app.get('/admin',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	
	var p_image = defaultimage;
	var ad_image = defaultadimage;
	var h_image = defaultheaderimage;
	if(p_image.length > 15){
		p_image = p_image.substring(0, 15) + '...' + p_image.substring(p_image.lastIndexOf('.')).toLowerCase();
	}	
	if(ad_image.length > 15){
		ad_image = ad_image.substring(0, 15) + '...' + ad_image.substring(ad_image.lastIndexOf('.')).toLowerCase();
	}
	if(h_image.length > 15){
		h_image = h_image.substring(0, 15) + '...' + h_image.substring(h_image.lastIndexOf('.')).toLowerCase();
	}


	var find = '<br />';
	var re = new RegExp(find, 'g');
	response.render('admin/admin.html',{title:"Culture on The Cheap: Admin Hub", headerimage: '../'+defaultheaderimage, email:email, aboutus:aboutus.replace(re, "\n"), contact:contact.replace(re, "\n"), description:description.replace(re, "\n"), adlink:adlink, adimage:ad_image, postimage:p_image, headeradimage: h_image, admin:getAdminHTML(request), categories: generateCategoryHTML(), categoryforms:generateCategoryFormHTML(true, false, "", "")});
});

app.post('/admin/submit', function(request, response){
   /* if(request.body.email && request.body.email.indexOf('@') != -1){
    	var newemail = request.body.email;
        if(newemail.localeCompare(email) != 0){
		email = newemail;	
	        delete request.session.email;
        	response.redirect('/home');
		}
		else{
	    	response.redirect('/admin');
		}
    }
    else{
	    response.redirect('/admin');
    } */

    var find = '\n';
    var re = new RegExp(find, 'g');
    aboutus = verifyString(request.body.aboutus).replace(/\n$/, "").replace(re, "<br />");
    contact = verifyString(request.body.contact).replace(/\n$/, "").replace(re, "<br />");
    description = verifyString(request.body.description).replace(/\n$/, "").replace(re, "<br />");
    
    console.log(description);
    adlink = verifyString(request.body.adlink);
        
    var tempPath = request.files.adimage.path;
    var ext = path.extname(request.files.adimage.name).toLowerCase();
    var targetPath = 'public/images/uploads/ads/' + generateImageIdentifier() + ext;
    
    console.log(tempPath + " " + targetPath + request.files.adimage.name);
    if(tempPath.length != 0){
	    if (IMAGEFILEFORMATS.indexOf(ext) > -1) {
	    	defaultadimage = targetPath;
	        fs.rename(tempPath, targetPath, function(err) {
	            if (err) console.error(err);
	            console.log("Upload completed!");
	        });
	    } else {
	        fs.unlink(tempPath, function (err) {
	            if (err) console.error(err);
			    //defaultadimage = DEFAULTADIMAGE;
	        });
    	}
    }

	var tempPath2 = request.files.postimage.path;
    var ext2 = path.extname(request.files.postimage.name).toLowerCase();
    var targetPath2 = 'public/images/uploads/' + generateImageIdentifier() + ext2;
    console.log(tempPath2 + " " + targetPath2 + request.files.postimage.name);
    if(tempPath2.length != 0){
	    if (IMAGEFILEFORMATS.indexOf(ext2) > -1) {
	        defaultimage = targetPath2;	    
	        fs.rename(tempPath2, targetPath2, function(err) {
	            if (err) console.error(err);
	            console.log("Upload completed!");
	        });
	    } else {
	        fs.unlink(tempPath2, function (err) {
	            if (err) console.error(err);
			    //defaultimage = DEFAULTIMAGE;
	        });
    	}
    }

    var tempPath3 = request.files.headerimage.path;
    var ext3 = path.extname(request.files.headerimage.name).toLowerCase();
    var targetPath3 = 'public/images/uploads/ads/' + generateImageIdentifier() + ext3;

    console.log(tempPath3 + " " + targetPath3 + request.files.headerimage.name);
    if(tempPath3.length != 0){
	    if (IMAGEFILEFORMATS.indexOf(ext3) > -1) {
	        defaultheaderimage =  targetPath3;
	        fs.rename(tempPath3, targetPath3, function(err) {
	            if (err) console.error(err);
	            console.log("Upload completed!");
	        });
	    } else {
	        fs.unlink(tempPath3, function (err) {
	            if (err) console.error(err);
			    //defaultheaderimage = DEFAULTHEADERIMAGE;
	        });
    	}
    }
    
    try{
	    var superstr = "";
	  	superstr += "DEFAULTIMAGE\r\n";
  		superstr += defaultimage + "\r\n";
  		superstr += "DEFAULTADIMAGE\r\n";
	  	superstr += defaultadimage + "\r\n";
	  	superstr += "DEFAULTHEADERIMAGE\r\n";
	  	superstr += defaultheaderimage + "\r\n";
	  	superstr += "ADLINK\r\n";
	  	superstr += adlink + "\r\n";
	  	superstr += "ABOUTUS\r\n";
	  	superstr += aboutus + "\r\n";
	  	superstr += "CONTACT\r\n";
	   	superstr += contact + "\r\n";
	  	superstr += "DESCRIPTION\r\n";  
	   	superstr += description + "\r\n";
	   	superstr += "CATEGORIES\r\n";
	   	for(i in categoryIDS){
	   		superstr += categoryIDS[i].replace("\r", "") + "\n";
	   	}
	
	    fs.writeFile('savedata.txt', superstr, function (err) {
	    	if (err) return console.log(err);
			console.log("Saved admin preferences!");
    	});    
    } catch(e){
    	console.log(e);
    }
    
    response.redirect('/admin'); 
});

app.post('/admin/submit2', function(request, response){
    for(var i = 0; i < categoryIDS.length; i++){
	if(!request.body[categoryIDS[i]]){
		categoryIDS.splice(i, 1);
		i--;
	}
    }

    if(request.body.newcategory && request.body.newcategory.replace(/\s/g, '').length != 0){
	categoryIDS.push(request.body.newcategory);
	categoryIDS.sort();
    }

    try{
	    var superstr = "";
	  	superstr += "DEFAULTIMAGE\r\n";
  		superstr += defaultimage + "\r\n";
  		superstr += "DEFAULTADIMAGE\r\n";
	  	superstr += defaultadimage + "\r\n";
	  	superstr += "DEFAULTHEADERIMAGE\r\n";
	  	superstr += defaultheaderimage + "\r\n";
	  	superstr += "ADLINK\r\n";
	  	superstr += adlink + "\r\n";
	  	superstr += "ABOUTUS\r\n";
	  	superstr += aboutus + "\r\n";
	  	superstr += "CONTACT\r\n";
	   	superstr += contact + "\r\n";
	  	superstr += "DESCRIPTION\r\n";  
	   	superstr += description + "\r\n";
	   	superstr += "CATEGORIES\r\n";
	   	for(i in categoryIDS){
	   		superstr += categoryIDS[i].replace("\r", "");
	   		if(i < categoryIDS.length - 1){
		   		superstr += "\n";	   		
	   		}
	   	}
	
	    fs.writeFile('savedata.txt', superstr, function (err) {
	    	if (err) return console.log(err);
			console.log("Saved admin preferences!");
    	});    
    } catch(e){
    	console.log(e);
    }


    response.redirect('/admin');
});


app.post('/admin/form',function(request,response){
	if(!checkAdmin(request, response)){
		return;
	}
	response.redirect('/admin');
});

app.post('/auth/login', function(request, response){
    var assertion, requestBody, requestHeaders;

    assertion = request.body.assertion;
    requestBody = JSON.stringify({
      assertion: assertion,
      audience: process.env.AUDIENCE || hostname + PORT
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
      if (res.status == 'okay' && res.email.localeCompare(email) == 0) {
        request.session.email = res.email;
	response.send('yes');
	return;
      } else {
	if(request.session && 'email' in request.session){
		delete request.session.email;	
	}
        request.session = null;
	
        response.send('no');
        return console.log(res);
      }
    }); 
});

app.post('/auth/logout', function(request, response){ 
    delete request.session.email;
    return response.send('done');
});

app.get('/submit',function(request,response){
	response.render('submit.html',{title:"Submit A Post!", headerimage:defaultheaderimage, description:description, adlink:adlink, admin:getAdminHTML(request), categoryforms:generateCategoryFormHTML(false, false, -1, -1), categories: generateCategoryHTML()});
});

app.post('/search',function(request,response){
	checkSession(request);
	//DO MORE THINGS TO lace the sql query together from the request
	var keyword = request.body.textsearch;
	var post_html = '';
	var today = new Date();
	var modify_d = moment(today).format('YYYYMMDD')
	request.session.preview = PREVIEW.APPROVED;
	request.session.order = ORDER.ED;
	var sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos FROM posts WHERE enddate >= "+modify_d+" AND (title LIKE '%"+keyword+"%' OR body like '%"+keyword+"%')";

	sql += " UNION SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos FROM posts WHERE enddate >= "+modify_d+" AND (category='Advertisement' OR category2='Advertisement') " + request.session.order.sql;

	var q;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q = conn.query(sql,[]);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q = conn_admin.query(sql,[]);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q = conn_trash.query(sql,[]);
	}
	
	var htmls = [];
	var adhtmls = [];
	q.on('row', function(row){
				
			post_html = generatePostHTML(request, row);
			var isAd = false; //let's figure out whether this is an ad or not

			if(row.category.localeCompare("Advertisement") == 0 || (row.category2 && row.category2.localeCompare("Advertisement") == 0)){
				isAd = true;
			}

			if(isAd){
				adhtmls.push({html: post_html, adpos: row.adpos});
			}
			else{
				htmls.push(post_html);
			}
		}).on('end',function(){
			post_html = "";

			adhtmls.sort(function(a,b){return a.adpos-b.adpos});
			for(var i = 0; i < adhtmls.length; i++){
				htmls.splice(adhtmls[i].adpos - 1, 0, adhtmls[i].html);	
			}


			for(var i = 0; i < htmls.length; i++){
				post_html += htmls[i];
			}
		response.render('homepage.html',{title:"Search Results", headerimage:defaultheaderimage, posts:post_html,preview:getPreviewHTML(request), description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
	});
});

app.get('/login',function(request,response){
	response.render('login.html',{title:"Login", headerimage:defaultheaderimage, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
});

/**
  * These following commands are used to help sort the events on the page.
  */

app.get('/mp',function(request,response){
	request.session.order = ORDER.MP;
	response.redirect('/'+request.session.category);
});

app.get('/l2h',function(request,response){
	request.session.order = ORDER.L2H;
	response.redirect('/'+request.session.category);
});

app.get('/ed',function(request,response){
	request.session.order = ORDER.ED;
	response.redirect('/'+request.session.category);
});

app.get('/pd',function(request,response){
	request.session.order = ORDER.PD;
	response.redirect('/'+request.session.category);
});

app.get('/unappr',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	request.session.preview = PREVIEW.UNAPPROVED;
	response.redirect('/'+request.session.category);
});

app.get('/appr',function(request,response){
	request.session.preview = PREVIEW.APPROVED;
	response.redirect('/'+request.session.category);
});

app.get('/reje',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	request.session.preview = PREVIEW.REJECTED;
	response.redirect('/'+request.session.category);
});


app.get('/about',function(request,response){
	response.render('about.html',{title:"About Us", headerimage:defaultheaderimage, aboutus:aboutus, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
});

app.get('/contact',function(request,response){
	response.render('contact.html',{title:"Contact Us", headerimage:defaultheaderimage, contact:contact, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
});

app.get('/about.html',function(request,response){
	response.render('about.html',{title:"About Us", headerimage:defaultheaderimage, aboutus:aboutus, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
});

app.get('/contact.html',function(request,response){
	response.render('contact.html',{title:"Contact Us", headerimage:defaultheaderimage, contact:contact, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
});

app.get('/edit/:postid',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	var sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,adpos FROM posts WHERE id == "+request.params.postid+" ORDER BY startdate DESC";
	var q;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q = conn.query(sql);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q = conn_admin.query(sql);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q = conn_trash.query(sql);
	}
	var item = {};

	var count = 0;

	q.on('row', function(row){
		var adpos = row.adpos;
		if(!adpos || adpos == -1){
			adpos = '';
		}

		var categorypos = categoryIDS.indexOf(row.category);
		if(row.category.localeCompare("Advertisement") == 0){
			categorypos = categoryIDS.length;
		}

		var categorypos2 = categoryIDS.indexOf(row.category2);
		if(row.category2 && row.category2.localeCompare("Advertisement") == 0){
			categorypos2 = categoryIDS.length;
		}

		var title = row.title;
		if(!title){
			title = '';
		}

		var img = row.image;
		if(!img){
			img = '';
		}

		count++;
		item = {category: categorypos, category2: categorypos2, title: title, image: img, startdate: row.startdate.toString(), enddate: row.enddate.toString(), time: row.time.toString(), body: row.body, linkto: row.linkto, price:row.price, adposition: adpos};
		
		}).on('end',function(){
			try{
				var p_image = item.image;

				if(p_image.length > 15){
					p_image = p_image.substring(0, 15) + '...' + p_image.substring(p_image.lastIndexOf('.')).toLowerCase();
				}	
				
				var find = ' ';
				var re = new RegExp(find, 'g');
				if(count > 0){
				response.render('admin/edit.html',{title:"Edit A Post!", headerimage:'../'+defaultheaderimage, postid:request.params.postid, eventtitle:item.title.replace(re, "&nbsp;"), eventcategory: item.category, eventcategory2: item.category2, eventbody: item.body, actualeventimage: item.image.replace(re, "&nbsp;"), eventimage: p_image.replace(re, "&nbsp;"), eventlinkto: item.linkto, eventstartdate: item.startdate, eventenddate: item.enddate, eventtime: item.time, eventprice: item.price, description:description, admin:getAdminHTML(request), adposition: item.adposition, categories: generateCategoryHTML(), categoryforms: generateCategoryFormHTML(false, true, item.category, item.category2)});
				}
				else{
				response.render('error.html',{title:"Error", headerimage:defaultheaderimage, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});	
				}
			}
			catch(e){
				console.log(e);
				response.render('error.html',{title:"Error", headerimage:defaultheaderimage, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});	
			}
	});
});


app.post('/edit/form',function(request,response){
	if(!checkAdmin(request, response)){
		return;
	}
	response.redirect('/'+request.session.category);
});

app.get('/approve/:postid',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	var sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,adpos FROM posts WHERE id == "+request.params.postid + " ORDER BY startdate DESC";
	var q = conn_admin.query(sql);

	var sql2 = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q2 = conn_admin.query(sql2);
	q.on('row', function(row){
			var today = new Date();
			//var modify_d = moment(today).format('YYYYMMDDHHmmssSSS');
			var modify_d = moment(today).format('X');
			var sql = 'INSERT INTO posts (category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

			var q = conn.query(sql, [row.category, row.category2, row.title, row.image, row.startdate, row.enddate, row.time, row.body, row.linkto,row.price,modify_d,row.adpos]); 
			q.on('error', console.error);

		}).on('end',function(){
    			response.redirect('/'+request.session.category);
	});
});

app.get('/reject/:postid',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	var sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,adpos FROM posts WHERE id == "+request.params.postid + " ORDER BY startdate DESC";
	var q;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q = conn.query(sql);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q = conn_admin.query(sql);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q = conn_trash.query(sql);
	}

	var sql2 = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q2;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q2 = conn.query(sql2);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q2 = conn_admin.query(sql2);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q2 = conn_trash.query(sql2);
	}

	q.on('row', function(row){

			var sql = 'INSERT INTO posts (category,category2, title,image,startdate,enddate,time,body,linkto,price,adpos) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';

			var q = conn_trash.query(sql, [row.category, row.category2, row.title, row.image, row.startdate, row.enddate, row.time, row.body, row.linkto,row.price, row.adpos]);
			q.on('error', console.error);

		}).on('end',function(){
    			response.redirect('/'+request.session.category);
	});
});

app.get('/restore/:postid',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	var sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price, adpos FROM posts WHERE id == "+request.params.postid + " ORDER BY startdate DESC";
	var q = conn_trash.query(sql);

	var sql2 = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q2 = conn_trash.query(sql2);

	q.on('row', function(row){
			var sql = 'INSERT INTO posts (category,category2,title,image,startdate,enddate,time,body,linkto,price,adpos) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, $10,$11)';
			var q = conn_admin.query(sql, [row.category, row.category2, row.title, row.image, row.startdate, row.enddate, row.time, row.body, row.linkto, row.price, row.adpos]);
			q.on('error', console.error);

		}).on('end',function(){
    			response.redirect('/'+request.session.category);
	});
});

app.get('/delete/:postid',function(request,response){
	if(!checkAdminAccess(request, response)){
		return;
	}
	var sql = "DELETE FROM posts WHERE id == "+request.params.postid;
	var q = conn_trash.query(sql);
    	response.redirect('/'+request.session.category);
});

app.get('/:Category',function(request,response){
		checkSession(request);
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
			response.render('error.html',{title:"Error", headerimage:defaultheaderimage, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
		}
		else {
			request.session.category = cat;
			//format of the date will be 6 digits: YearMonthDay
			//so keep this in mind for the "SUBMIT" option
			var today = new Date();
			var modify_d = moment(today).format('YYYYMMDD')
			var sql;
			if (isDate){
				sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos FROM posts WHERE startdate<=$1 AND enddate >=$1";
			}
			else{
				sql = "SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos FROM posts WHERE (category=$1 OR category2=$1) AND enddate >= "+modify_d;
			}
			sql += " UNION SELECT DISTINCT id,category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos FROM posts WHERE enddate >= "+modify_d+" AND (category='Advertisement' OR category2='Advertisement') " + request.session.order.sql;
			
			var q;
			
			if(request.session.preview.value == PREVIEW.APPROVED.value){
				q = conn.query(sql, [cat]);
			}
			if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
				q = conn_admin.query(sql, [cat]);
			}
			if(request.session.preview.value == PREVIEW.REJECTED.value){
				q = conn_trash.query(sql, [cat]);
			}
			var post_html='';
			var htmls = [];
			var adhtmls = [];
			q.on('row', function(row){
				
				post_html = generatePostHTML(request, row);
				var isAd = false; //let's figure out whether this is an ad or not

				if(row.category.localeCompare("Advertisement") == 0 || (row.category2 && row.category2.localeCompare("Advertisement") == 0)){
					isAd = true;
				}
				if(isAd){
					adhtmls.push({html: post_html, adpos: row.adpos});
				}
				else{
					htmls.push(post_html);
				}
			}).on('end',function(){
				post_html = "";

				adhtmls.sort(function(a,b){return a.adpos-b.adpos});
				for(var i = 0; i < adhtmls.length; i++){
					htmls.splice(adhtmls[i].adpos - 1, 0, adhtmls[i].html);	
				}


				for(var i = 0; i < htmls.length; i++){
					post_html += htmls[i];
				}
				if (post_html==''){
					post_html = "No results found.";
				}
				response.render('results.html',{title:cat, headerimage:defaultheaderimage, posts:post_html,preview:getPreviewHTML(request), description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
			});
		}
});

app.post('/submit/submit', function(request, response){
    // post everything to the database, then...

    var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

    var cat = "";
    var cat2 = "";
    for(var i = 0; i < categoryIDS.length; i++){
	if(request.body[categoryIDS[i]] && cat.length == 0){
		cat = categoryIDS[i];
	}
	else if(request.body[categoryIDS[i]]){
		cat2 = categoryIDS[i];
		break;
	}
    }


    var title = verifyString(request.body.title);
    var price = parseInt(verifyString(request.body.price));
    if(!price){
		price = 0;
    }

    var startmonth = monthtext.indexOf(request.body.startmonth) + 1;
    var startday = request.body.startday;

    var hour = request.body.hour;
    var minute = request.body.minutes;
    var ampm = request.body.ampm;
    if (ampm === "PM") {
    	hour = parseInt(hour, 10) + 12;
    }

    if(startmonth < 10){
    	startmonth = '0' + startmonth;
    }
    if(startday < 10){
    	startday = '0' + startday;
    }
    var startdate = parseInt(request.body.startyear + startmonth + startday); 

    var endmonth = monthtext.indexOf(request.body.endmonth) + 1;
    var endday = request.body.endday;

    if(endmonth < 10){
    	endmonth = '0' + endmonth;
    }
    if(endday < 10){
    	endday = '0' + endday;
    }
    var enddate = parseInt(request.body.endyear + endmonth + endday); 
    var time = hour+minute;
    var body = verifyString(request.body.description);
    var linkto = request.body.linkto;

    linkto = linkto.replace("https://", "");
    linkto = linkto.replace("http://", "");

    /*var ext = image.substring(image.lastIndexOf('.')).toLowerCase();
    var imageshortcut = "";
    if(IMAGEFILEFORMATS.indexOf(ext) > -1){
	    imageshortcut = 'public/images/uploads/' + generateImageIdentifier() + ext;

	    http.get(image, imageshortcut, function (error, result) {
		if (error) {
		    console.error(error);
		    imageshortcut = defaultimage;
		} else {
		    console.log('File downloaded at: ' + result.file);
		}
	    });
    }
    else{
		console.log("Not a supported image file format. Using default picture instead. ");
		imageshortcut = defaultimage;
    }*/
    
    var tempPath = request.files.image.path;
    var ext = path.extname(request.files.image.name).toLowerCase();
    var targetPath = 'public/images/uploads/' + generateImageIdentifier() + ext;
    var imageshortcut = targetPath;
    
    if(tempPath.length != 0){
	    if (IMAGEFILEFORMATS.indexOf(ext) > -1) {
	        fs.rename(tempPath, targetPath, function(err) {
	            if (err) console.error(error);
	            console.log("Upload completed!");
	        });
	    } else {
	    	imageshortcut = defaultimage;
	        fs.unlink(tempPath, function (err) {
	            if (err) console.error(error);
	        });
    	}
    }

    var sql = 'INSERT INTO posts (category, category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

    var q = conn_admin.query(sql, [cat, cat2, title, imageshortcut, startdate, enddate, time, body, linkto, price, 0, 0]);

    q.on('error', console.error);

    response.redirect('/'+request.session.category);
});


app.post('/edit/submit', function(request, response){
	if(!checkAdmin(request, response)){
		return;
	}
    response.redirect('/'+request.session.category);

    var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

    var cat = "";
    var cat2 = "";
    for(var i = 0; i < categoryIDS.length; i++){
		if(request.body[categoryIDS[i]] && cat.length == 0){
			cat = categoryIDS[i];
		}
		else if(request.body[categoryIDS[i]]){
			cat2 = categoryIDS[i];
			break;
		}
    }

    if(request.body["Advertisement"]){
		cat = "Advertisement";
		cat2 = "";
    }

    var title = verifyString(request.body.title);
    var price = parseInt(verifyString(request.body.price));
    if(!price){
		price = 0;
    }
    


    var tempPath = request.files.image.path;
    var ext = path.extname(request.files.image.name).toLowerCase();
    var targetPath = 'public/images/uploads/' + generateImageIdentifier() + ext;
	var imageshortcut = targetPath;

    if(tempPath.length != 0){
	    if (IMAGEFILEFORMATS.indexOf(ext) > -1) {
	        fs.rename(tempPath, targetPath, function(err) {
	            if (err) console.error(err);
	            console.log("Upload completed!");
	        });
	    } else {
	    	imageshortcut = request.body.actualimage;
	        fs.unlink(tempPath, function (err) {
	            if (err) console.error(err);
	        });
    	}
    }
    else{
    	imageshortcut = request.body.actualimage;
    }
   
    var startmonth = monthtext.indexOf(request.body.startmonth) + 1;
    var startday = request.body.startday;

    var hour = request.body.hour;
    var minute = request.body.minutes;
    var ampm = request.body.ampm;
    if (ampm === "PM") {
    	hour = parseInt(hour, 10) + 12;
    }

    if(startmonth < 10){
    	startmonth = '0' + startmonth;
    }
    if(startday < 10){
    	startday = '0' + startday;
    }
    var startdate = parseInt(request.body.startyear + startmonth + startday); 

    var endmonth = monthtext.indexOf(request.body.endmonth) + 1;
    var endday = request.body.endday;

    if(endmonth < 10){
    	endmonth = '0' + endmonth;
    }
    if(endday < 10){
    	endday = '0' + endday;
    }
    var enddate = parseInt(request.body.endyear + endmonth + endday); 
    var time = hour+minute;
    var body = verifyString(request.body.description);
    var linkto = request.body.linkto;

    var adpos = parseInt(verifyString(request.body.adposition));
    if(!adpos){
		adpos = -1;
    }


    var postid = request.body.postid;
    
    var sql2 = "DELETE FROM posts WHERE id == " + postid;
	var q2;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q2 = conn.query(sql2);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q2 = conn_admin.query(sql2);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q2 = conn_trash.query(sql2);
	}

    var sql = 'INSERT INTO posts (category,category2,title,image,startdate,enddate,time,body,linkto,price,postdate,adpos) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

	var q;
	if(request.session.preview.value == PREVIEW.APPROVED.value){
		q = conn.query(sql, [cat, cat2, title, imageshortcut, startdate, enddate, time, body, linkto, price, 0, adpos]);
	}
	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		q = conn_admin.query(sql, [cat, cat2, title, imageshortcut, startdate, enddate, time, body, linkto, price, 0, adpos]);
	}
	if(request.session.preview.value == PREVIEW.REJECTED.value){
		q = conn_trash.query(sql, [cat, cat2, title, imageshortcut, startdate, enddate, time, body, linkto, price, 0, adpos]);
	}
    q.on('error', console.error);
});


var  https = require('https');

var http = require('http-get');


app.listen(PORT, function(){
  console.log("FreeCulture server listening on "+PORT);
});


/**
  * The following are additional functions to help with some server code stuffs.
  */

function getPreviewHTML(request){
	var preview_html = '';

	if('email' in request.session && request.session.email.localeCompare(email) == 0){
		//preview_html += "<button id='signout' class='hidden'>Sign out</button>";
		preview_html += "<div id='sort_nav_container'>";
		preview_html +=	"<ul id='sort_nav'>";
		preview_html += "<li id='sort_by'>Preview: </li>";
		preview_html += "<li id='price_low_high'><a href='/unappr'>Unapproved Posts</a></li>";
		preview_html +=	"<li id='event_date'><a href='/appr'>Approved Posts</a></li>";
		preview_html += "<li id='event_date'><a href='/reje'>Rejected Posts</a></li>";
		/*if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
			preview_html += "<li id='event_date'><button id='delete' >Reject All</button></li>";
		}
		else if(request.session.preview.value == PREVIEW.REJECTED.value){
			preview_html += "<li id='event_date'><button id='delete' >Delete All</button></li>";
		}*/
		preview_html += "</ul></div>";
	}
	return preview_html;
}

function getEditHTML(request, postid){
	var post_html = '';
	if(!checkAdmin(request)){
		return post_html;
	}

	if(request.session.preview.value == PREVIEW.UNAPPROVED.value){
		post_html += "<div class ='admin'><a href='edit/" + postid +"'>Edit</a>";
		post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/approve/" + postid +"'>Approve</a>";
		post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/reject/" + postid +  "'>Reject</a></div>";
	} else if(request.session.preview.value == PREVIEW.APPROVED.value){
		post_html += "<div class ='admin'><a href='edit/" + postid +"'>Edit</a>";
		post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/reject/" + postid +  "'>Reject</a></div>";
	} else if(request.session.preview.value == PREVIEW.REJECTED.value){
		post_html += "<div class ='admin'><a href='edit/" + postid +"'>Edit</a>";
		post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/restore/" + postid +  "'>Restore</a>";
		post_html += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/delete/" + postid +  "'>Delete</a></div>";
	}

	return post_html;
}


function generatePostHTML(request, row){
	if(!row){
		return;
	}
	var post_html = "";
	var isAd = false; //let's figure out whether this is an ad or not
	
	if(!row.category){
		console.log("1st category not defined:");
		console.log(row);
	}
	if((row.category && row.category.localeCompare("Advertisement") == 0) || (row.category2 && row.category2.localeCompare("Advertisement") == 0)){
		isAd = true;
	}
	var linkto = row.linkto;
	if(linkto && linkto.substring(0,7).localeCompare("http://") != 0){
		linkto = "http://" + linkto;
	}

	post_html = '';
	if(isAd){
		post_html += "<div class ='adpost'>";
	}
	else{
		post_html += "<div class ='post'>";
	}
	post_html += "<a href = '"+linkto+"' target='"+row.title+"'>";
	post_html += "<div class ='corner'></div>";
	if(!isAd){
		post_html += "<div class ='hover'>";
		post_html += getEditHTML(request, row.id);
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
	}
	else if(checkAdmin(request)){
		post_html += "<div class ='hover'>";
		post_html += getEditHTML(request, row.id);
		post_html += "</div>";
	}
	var image = row.image;
	if(!row.image || row.image.localeCompare("") == 0){
		image = defaultimage;
	}
	if(isAd){
		post_html += "<img src ='" + image + "'" + " onerror=\"this.src ='" + defaultadimage + "'\" >";
	}
	else {
		post_html += "<img src ='" + image + "'" + " onerror=\"this.src ='" + defaultimage + "'\" >";
		if(row.category2){
			post_html += "<h1>" + row.category + "&nbsp;&#9642;&nbsp;" + row.category2 + "</h1>";		
		} else{
			post_html += "<h1>" + row.category + "</h1>";
		}
		post_html += "<h2>" + row.title + "</h2>";
	}
	if(!isAd){

		post_html += "<h3>" + row.startdate.toString().substring(4,6) + "/" + row.startdate.toString().substring(6) + "/" + row.startdate.toString().substring(0,4);					
		if(row.startdate != row.enddate){
			post_html +=  " - " + row.enddate.toString().substring(4,6) + "/" + row.enddate.toString().substring(6) + "/" + row.enddate.toString().substring(0,4);
		} 					
		post_html += "</h3></a>";

	}	
	else{
		post_html += "<h3>" +  "&nbsp;</h3>";	
	}			
	post_html += "</div>";

	return post_html;
}

function getAdminHTML(request){
	var admin = '';
	if(checkAdmin(request)){
		admin = "<li id='admin'><a href='" + "/admin" + "'>Admin</a></li>";
	}
	return admin;
}

function verifyString(str){
	var convert = "";	
	if(!str){
		return convert;
	}
	return str;
}




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

function checkAdmin(request) {
	if('email' in request.session && request.session.email.localeCompare(email) == 0){
		return true;
	}	
	return false;
}
function checkAdminAccess(request, response){
	if(checkAdmin(request)){
		return true;
	}	
	response.render('login.html',{title:"Login", headerimage:defaultheaderimage, description:description, adlink:adlink, admin:getAdminHTML(request), categories: generateCategoryHTML()});
	return false;
}


function convertTime(time){
	var timestr = time.toString();
	
	while(timestr.length < 4){
		timestr = '0' + timestr;
	}
	if (time < 1200){
		if (time < 100){
			return "12:" + timestr.substring(2) + " AM";
		}
		else{
			return timestr.substring(0,2) + ":" + timestr.substring(2) + " AM";
		}
	}
	else{
		if (time < 1300){
			return "12:" + timestr.substring(2) + " PM";
		}
		else{
			timestr = (time - 1200).toString();
	
			while(timestr.length < 4){
				timestr = '0' + timestr;
			}		
			return timestr.toString().substring(0,2) + ":" + timestr.substring(2) + " PM";
		}	
	}
}

function checkSession(request){
	if(!('category' in request.session)){
		request.session.category = "";
	}
	if(!('preview' in request.session)){
		request.session.preview = PREVIEW.APPROVED;
	}
	if(!('order' in request.session)){
		request.session.order = ORDER.ED;
	}
}

function generateImageIdentifier() {
    // make a list of legal characters
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    var result = '';
    for (var i = 0; i < 24; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}

function generateCategoryHTML() {
	var category_html = "";
	for(var i = 0; i < categoryIDS.length; i++){
		category_html += "<li id='" + categoryIDS[i] + "'><a href='" + categoryIDS[i] + "'>" + categoryIDS[i] + "</a></li>";
	}
	return category_html;
}

function generateCategoryFormHTML(selectall, includead, categoryID, categoryID2) {
	var category_html = "";
	var category = "";
	var category2 = "";
	if(categoryID == categoryIDS.length){
		category = "Advertisement";
	}
	else if(categoryID > 0){
		category = categoryIDS[categoryID];
	}
	if(categoryID2 == categoryIDS.length){
		category2 = "Advertisement";
	}
	else if(categoryID2 > 0){
		category2 = categoryIDS[categoryID2];
	}

	console.log(category + " " + category2 + " " + categoryID + " " + categoryID2);
	for(var i = 0; i < categoryIDS.length; i++){
		category_html += "<input type='checkbox' name='" + categoryIDS[i] + "' value='" + categoryIDS[i] + "'";
		if(category.localeCompare(categoryIDS[i]) == 0 || category2.localeCompare(categoryIDS[i]) == 0 || selectall){		
			category_html += " checked";
		}
		category_html += "> " + categoryIDS[i] + "<br>"; 
	}

	if(includead){
		category_html += "<input type='checkbox' name='" + "Advertisement" + "' value='" + "Advertisement" + "'";
		if(category.localeCompare("Advertisement") == 0 || category2.localeCompare("Advertisement") == 0 || selectall){		
			category_html += " checked";
		}
		category_html += "> " + "Advertisement" + "<br>"
	}
	return category_html;
}

