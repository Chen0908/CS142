DESTDIR = ../../web-new/downloads
DESTFILE = project6.zip
PROJECTFILES = package.json nodemon.json webServer.js loadDatabase.js schema test .jshintrc index.html 
$(DESTFILE): $(PROJECTFILES)
	zip -r $(DESTFILE)  $(PROJECTFILES)
   	
$(DESTDIR)/$(DESTFILE): $(DESTFILE)
	cp $(DESTFILE) $(DESTDIR)

install: $(DESTDIR)/$(DESTFILE)

.PHONY: clean

clean:
	rm -f $(DESTFILE)
