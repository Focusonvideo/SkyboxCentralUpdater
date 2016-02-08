'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /icLogin when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/icLogin");
  });


  describe('icLogin', function() {

    beforeEach(function() {
      browser.get('index.html#/icLogin');
    });


    it('should render icLogin when user navigates to /icLogin', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('MainPanel', function() {

    beforeEach(function() {
      browser.get('index.html#/MainPanel');
    });


    it('should render MainPanel when user navigates to /MainPanel', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
