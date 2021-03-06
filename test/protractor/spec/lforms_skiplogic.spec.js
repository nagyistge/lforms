var tp = require('./lforms_testpage.po.js');
var ff = tp.FullFeaturedForm;
describe('skip logic', function() {

  it('target items should be hidden initially', function() {
    tp.openFullFeaturedForm();
    // initially all hidden
    expect(ff.t1.isPresent()).toBeFalsy();
    expect(ff.t2.isPresent()).toBeFalsy();
    expect(ff.t4.isPresent()).toBeFalsy();
    expect(ff.t5.isPresent()).toBeFalsy();
  });

  it('should show a sibling and two items in a sibling section', function() {
    ff.src.sendKeys('1');
    expect(ff.t1.isDisplayed()).toBe(true);
    expect(ff.t4.isDisplayed()).toBe(true);
    expect(ff.t5.isDisplayed()).toBe(true);
  });

  it('should hide a sibling and show two items in a sibling section', function() {
    ff.src.clear();
    expect(ff.t1.isPresent()).toBeFalsy();
    expect(ff.t2.isPresent()).toBeFalsy();
    expect(ff.t4.isPresent()).toBeFalsy();
    expect(ff.t5.isPresent()).toBeFalsy();
    ff.src.sendKeys('2');
    expect(ff.t1.isPresent()).toBeFalsy();
    expect(ff.t2.isDisplayed()).toBe(true);
    expect(ff.t4.isDisplayed()).toBe(true);
    expect(ff.t5.isDisplayed()).toBe(true);
  });

  it('should show another sibling and hide two items in a sibling section', function() {
    ff.src.clear();
    expect(ff.t1.isPresent()).toBeFalsy();
    expect(ff.t2.isPresent()).toBeFalsy();
    expect(ff.t4.isPresent()).toBeFalsy();
    expect(ff.t5.isPresent()).toBeFalsy();
    ff.src.sendKeys('6');
    expect(ff.t1.isPresent()).toBeFalsy();
    expect(ff.t2.isDisplayed()).toBe(true);
    expect(ff.t4.isPresent()).toBeFalsy();
    expect(ff.t5.isPresent()).toBeFalsy();
  });

  it('should work with logic ALL from two different sources', function() {
    // check logic ALL
    ff.allSrc1.clear();
    ff.allSrc2.clear();
    ff.allSrc1.sendKeys('1');
    expect(ff.allTarget.isPresent()).toBe(false);
    ff.allSrc2.sendKeys('2');
    expect(ff.allTarget.isDisplayed()).toBe(true);
    ff.anySrc1.clear();
    ff.allSrc1.sendKeys('2');
    expect(ff.allTarget.isPresent()).toBe(false);
  });

  it('should work with logic ANY from two different sources', function() {
    // check logic ANY
    ff.anySrc1.clear();
    ff.anySrc2.clear();
    ff.anySrc1.sendKeys('1');
    expect(ff.anyTarget.isDisplayed()).toBe(true);
    ff.anySrc2.sendKeys('1');
    expect(ff.anyTarget.isDisplayed()).toBe(true);
    ff.anySrc1.sendKeys('2');
    ff.anySrc1.clear();
    expect(ff.anyTarget.isPresent()).toBe(false);
    ff.anySrc2.clear();
    ff.anySrc2.sendKeys('2');
    expect(ff.anyTarget.isDisplayed()).toBe(true);

  });

  it('should be able to be controlled by an ancestors sibling', function() {

    expect(ff.rpTarget2a.isPresent()).toBe(false);
    expect(ff.rpTarget2b.isPresent()).toBe(false);
    ff.rpSrc2.clear();
    expect(ff.rpTarget2a.isPresent()).toBe(false);
    expect(ff.rpTarget2b.isPresent()).toBe(false);
    ff.rpSrc2.sendKeys('1');
    expect(ff.rpTarget2a.isPresent()).toBe(false);
    ff.rpSrc2.clear();
    ff.rpSrc2.sendKeys('2');
    expect(ff.rpTarget2a.isDisplayed()).toBe(true);

    expect(ff.rpTarget1a.isPresent()).toBe(false);
    expect(ff.rpTarget1ah1.isPresent()).toBe(false);
    ff.rpSubSrc1.sendKeys('1');
    expect(ff.rpTarget1a.isDisplayed()).toBe(true);
    expect(ff.rpTarget1ah1.isDisplayed()).toBe(true);

    // add a new section
    ff.rpAdd.click();
    expect(ff.rpTarget1b.isPresent()).toBe(false);
    expect(ff.rpTarget1bh1.isPresent()).toBe(false);

    expect(ff.rpTarget2a.isDisplayed()).toBe(true);
    expect(ff.rpTarget2b.isDisplayed()).toBe(true);
    ff.rpSrc2.clear();
    ff.rpSrc2.sendKeys('1');
    expect(ff.rpTarget2a.isPresent()).toBe(false);
    expect(ff.rpTarget2b.isPresent()).toBe(false);
  });
});
