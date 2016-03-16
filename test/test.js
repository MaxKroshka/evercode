'use strict';

require('babel-polyfill');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/everCodeTest');

//////////////////////////////////////////////////////////
//                   User Model                         //
//////////////////////////////////////////////////////////
var User = require('../server/models/users');

var removeTestUser = function(callback){
  User.findOne({email: 'test@chai.com'}, function(err, result) {
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
}

describe('the User Model - basics', function () {
  it('should have makeUser function', function () {
    expect(User.makeUser).to.be.a('function');
  });

  it('should have getUser function', function () {
    expect(User.getUser).to.be.a('function');
  });

  it('should have updateUser function', function () {
    expect(User.updateUser).to.be.a('function');
  });

  it('should have a removeUser function', function () {
    expect(User.removeUser).to.be.a('function');
  });

  it('should have a checkCredentials helper function', function () {
    expect(User.checkCredentials).to.be.a('function');
  });
});

describe('the User Model - makeUser', function () {
  var tempUser;
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    var testMakeUser = function() {
      User.makeUser(testUser, function(err, returnedUser) {
        tempUser = returnedUser;
        done();
        returnedUser.remove();
      });
    }

    removeTestUser(testMakeUser);
  });
  
  it('should return an object', function() {
    expect(tempUser).to.be.an('object');
  });

  it('should have a unique id called _id', function() {
    expect(tempUser).to.have.property('_id');
  });
  
  it('should have an email property that is a string', function () {
    expect(tempUser).to.have.property('email', 'test@chai.com')
      .that.is.a('string');
  });
  it('should have a hashed _password property ', function () {
    expect(tempUser).to.have.property('_password')
      .that.is.a('string')
      .and.not.equal('just testing');
  });
  it('should have a snippets object', function(){
    expect(tempUser).to.have.property('snippets')
      .that.is.an('object')
  });
  it('should have a root folder in the snippets object', function(){
    expect(Object.keys(tempUser.snippets)).to.be.length(1);
  });

});

describe('the User Model - getUser', function () {

  var tempUser;
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    var testGetUser = function() {
      User.create(testUser)
        .then(function(returnedUser) {
          testUser = returnedUser;
          User.getUser(testUser.email ,function(err, result) {
            tempUser = result;
            done();
          })
        })
        .catch(function(err){
          done()
        }) 
    }

    removeTestUser(testGetUser);

  });
  
  it('should return an object', function() {
    expect(tempUser).to.be.an('object');
  });

  it('should have a unique id called _id', function() {
    expect(tempUser).to.have.property('_id');
  });
  
  it('should have an email property that is a string', function () {
    expect(tempUser).to.have.property('email', 'test@chai.com')
      .that.is.a('string');
  });
  it('should have an _password property', function () {
    expect(tempUser).to.have.property('_password')
  });
});

describe('the User Model - updateUser', function () {

  var tempUser;
  var updateResult;
  var userUpdates = {
    bio: 'I am a test',
  }
  var testUser = {
     email: 'test@chai.com',
    _password: 'just testing'
  };

  before(function(done) {
    var testUpdateUser = function () {
      User.create(testUser)
      .then(function(returnedUser) {
        testUser = returnedUser;
        User.updateUser(testUser.email, userUpdates ,function(err, result) {
          updateResult = result;
          User.findOne({_id: testUser._id}, function(err, returnedUser) {
            tempUser = returnedUser;
            done();
          })
        });
      })
      .catch(function(err){
        console.log(err);
        done()
      }) 
    }

    removeTestUser(testUpdateUser);
    
  });
  
  it('should return a results object', function() {
    expect(updateResult).to.be.an('object');
  });

  it('should report updating the document from the database', function() {
    expect(updateResult).to.have.property('n')
      .that.equals(1);
  });
  
  it('should update properties', function () {
    expect(tempUser).to.have.property('bio')
      .that.is.a('string')
      .and.equal('I am a test');
  });
});

describe('the User Model - removeUser', function () {

  var tempUser;
  var deleteResult;
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    var testRemoveUser = function () {
      User.create(testUser)
      .then(function(returnedUser){
        tempUser = returnedUser;
        User.removeUser(testUser.email ,function(err, result) {
          deleteResult = result;
          console.log("deleteResult",deleteResult);
          done();
        })
      })
      .catch(function(err){
        console.log(err);
        done()
      })
    }

    removeTestUser(testRemoveUser);

  });
  
  it('should return a results object', function() {
    expect(deleteResult.result).to.be.an('object')
      .that.has.property('ok');
  });

  it('should report removal from the database', function() {
    expect(deleteResult.result).to.have.property('n')
      .that.equals(1);
  });
  
  it('should not be able to find the test user', function (done) {
    User.findOne({_id: tempUser._id}, function(err, result){
      console.log("finding test user after delete", err,result)
      expect(result).to.be.null;
      done();
      if (result) {
        result.remove();
      }
    });
  });
});

//////////////////////////////////////////////////////////
//                   Snippet Model                      //
//////////////////////////////////////////////////////////
var Snippet = require('../server/models/snippets');

var removeTestSnippet = function(callback){
  Snippet.findOne({data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets'}, function(err, result) {
    console.log("removeTestSnippet", err, result)
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
}

describe('the Snippet Model - Snippet basics', function () {
  it('should have makeSnippet function', function () {
    expect(Snippet.makeSnippet).to.be.a('function');
  });

  it('should have getSnippet function', function () {
    expect(Snippet.getSnippet).to.be.a('function');
  });

  it('should have updateSnippet function', function () {
    expect(Snippet.updateSnippet).to.be.a('function');
  });

  it('should have a removeSnippet function', function () {
    expect(Snippet.removeSnippet).to.be.a('function');
  });
});

describe('the Snippet Model - makeSnippet', function (){

})

describe('the Snippet Model - getSnippet', function (){

})

describe('the Snippet Model - updateSnippet', function (){

})

describe('the Snippet Model - removeSnippet', function (){

})

describe('the Snippet Model - Folder basics', function () {

  it('should have a makeSubFolder function', function () {
    expect(Snippet.makeSubFolder).to.be.a('function');
  });

  it('should have a makeRootFolder function', function () {
    expect(Snippet.makeRootFolder).to.be.a('function');
  });

  it('should have a removeFolder function', function () {
    expect(Snippet.makeRootFolder).to.be.a('function');
  });

});

describe('the Snippet Model - makeSubFolder', function (){

})

describe('the Snippet Model - makeRootFolder', function (){

})

describe('the Snippet Model - removeFolder', function (){

})

describe('the Snippet Model - Snippet Getters', function(){

it('should have a getSnippetByFilepath function', function(){
  expect(Snippet.getSnippetByFilepath).to.be.a('function');
})

it('should have a getSnippetsByUser function', function(){
  expect(Snippet.getSnippetsByUser).to.be.a('function');
})

it('should have a getSnippetInfoByUser function', function(){
  expect(Snippet.getSnippetInfoByUser).to.be.a('function');
})

it('should have a getSnippetInfoByFolder function', function(){
  expect(Snippet.getSnippetInfoByFolder).to.be.a('function');
})

it('should have a getSnippetsByFolder function', function(){
  expect(Snippet.getSnippetsByFolder).to.be.a('function');
})


})


//////////////////////////////////////////////////////////
//                   User Routes                        //
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                   Snippet Routes                     //
//////////////////////////////////////////////////////////