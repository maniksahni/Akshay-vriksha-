const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const vm = require('node:vm');
const context = {};
vm.createContext(context);
vm.runInContext(readFileSync(join(__dirname,'../dist/signature.js'),'utf8'),context);
const {futureValue,storyState} = context.MoneytecSignatureModel;
test('month-end annuity agrees with an independently calculated one-year example',()=>{
  let total=0;
  for(let month=0;month<12;month++)total=total*(1+8/1200)+5000;
  assert.ok(Math.abs(futureValue(5000,8,1)-total)<.000001);
});
test('zero return reduces to total contributions, including zero horizon',()=>{
  assert.equal(futureValue(5000,0,20),1200000);
  assert.equal(futureValue(5000,8,0),0);
});
test('story input is bounded and has a usable fallback',()=>{
  assert.equal(storyState(-100).year,1);
  assert.equal(storyState(100).year,20);
  assert.equal(storyState('invalid').year,1);
});
test('visual growth and contributions match timeline endpoints',()=>{
  assert.equal(storyState(1).scale,.36);
  assert.equal(storyState(20).scale,1);
  assert.equal(storyState(10).invested,600000);
  assert.equal(storyState(10).chapter,10);
  assert.equal(storyState(20).chapter,20);
  assert.ok(storyState(20).value>storyState(10).value*2);
});
