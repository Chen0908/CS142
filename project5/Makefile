DESTDIR = ../../web-new/downloads
DESTFILE = project5.zip
PROJECTFILES = package.json modelData components images  main.css mainController.js \
	photo-share.html webServer.js node_modules index.html .jshintrc

$(DESTFILE): $(PROJECTFILES)
	zip -r $(DESTFILE)  $(PROJECTFILES)
   	
$(DESTDIR)/$(DESTFILE): $(DESTFILE)
	cp $(DESTFILE) $(DESTDIR)

install: $(DESTDIR)/$(DESTFILE)

.PHONY: clean

clean:
	rm -f $(DESTFILE)
