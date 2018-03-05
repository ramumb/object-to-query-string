'use strict';

var expect = require('chai').expect;
var toQueryString = require('../index');

describe('#toQueryString', function() {
    it('should return action=ship&order_id=123&fees=f1&fees=f2&label=a+demo', function() {
        var result = toQueryString({action: 'ship', order_id: 123, fees: ['f1', 'f2'], 'label': 'a demo'});
        expect(result).to.deep.equal('action=ship&order_id=123&fees=f1&fees=f2&label=a+demo');
    });

    it('should return section=blog&id=45', function() {
        var result = toQueryString({section: 'blog', id: '45'});
        expect(result).to.deep.equal('section=blog&id=45');
    });

    it('should return name=peter&age=23', function() {
        var result = toQueryString({name: 'peter', age: '23'});
        expect(result).to.deep.equal('name=peter&age=23');
    });

    it('should return animals=snake&animals=monkey&animals=lion', function() {
        var result = toQueryString({animals: ['snake', 'monkey', 'lion']});
        expect(result).to.deep.equal('animals=snake&animals=monkey&animals=lion');
    });
    
    it('should return lang=coffescript&tag=javascript&tag=prototype', function() {
        var result = toQueryString({lang: 'coffescript', tag: ['javascript', 'prototype']});
        expect(result).to.deep.equal('lang=coffescript&tag=javascript&tag=prototype');
    });
    
    it('should return tag=ruby+on+rails', function() {
        var result = toQueryString({tag: 'ruby on rails'});
        expect(result).to.deep.equal('tag=ruby+on+rails');
    });
    
    it('should return id=45&raw', function() {
        var result = toQueryString({id: "45", raw: undefined});
        expect(result).to.deep.equal('id=45&raw');
    });
});
