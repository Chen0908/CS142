DESTDIR = ../../web-new/downloads
DESTFILE = project7.zip
PROJECTFILES =  test loadDatabase.js 
$(DESTFILE): $(PROJECTFILES)
	zip -r $(DESTFILE)  $(PROJECTFILES)
   	
$(DESTDIR)/$(DESTFILE): $(DESTFILE)
	cp $(DESTFILE) $(DESTDIR)

install: $(DESTDIR)/$(DESTFILE)

.PHONY: clean

clean:
	rm -f $(DESTFILE)
