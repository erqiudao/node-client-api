/*
 * Copyright 2014 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var should = require('should');

var fs = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('default graph test', function(){
  var graphUri   = 'marklogic.com/defafult/people';
  var graphPath  = './test-complete/data/people.ttl';
  var sparqlPath = './test-complete/data/people.rq';
  var defGraphUri = 'http://marklogic.com/semantics#default-graph';

  it('should write the default graph', function(done){
    this.timeout(3000);
    db.graphs.write('text/turtle', fs.createReadStream(graphPath)).
    result(function(response){
      //console.log(JSON.stringify(response, null, 2));
      response.defaultGraph.should.equal(true);
      done();
    }, done);
  });

  it('should read the default graph', function(done){
    this.timeout(3000);
    db.graphs.read('application/json').
    result(function(data){
      (!valcheck.isNullOrUndefined(data)).should.equal(true);
      //console.log(JSON.stringify(data, null, 2))
      done();
    }, done);
  });

  it('should check the default graph', function(done){
    this.timeout(3000);
    db.graphs.probe().
    result(function(response){
      //console.log(response);
      response.should.have.property('graph');
      response.should.have.property('exists');
      response.exists.should.equal(true);
      response.defaultGraph.should.equal(true);
      done();
    }, done);
  });

  it('should list the graph', function(done){
    this.timeout(3000);
    db.graphs.list(). 
    result(function(collections){
      collections.some(function(collection){
        return collection === defGraphUri;
        }).should.equal(true);
      done();
    }, done);
  });

  /*it('should run a SPARQL query against the default graph', function(done){
    this.timeout(3000);
    db.graphs.sparql('application/sparql-results+json', fs.createReadStream(sparqlPath)).
    result(function(response){
      response.should.have.property('head');
      response.head.should.have.property('vars');
      response.head.vars.length.should.equal(2);
      response.head.vars[0].should.equal('personName1');
      response.head.vars[1].should.equal('personName2');
      response.should.have.property('results');
      response.results.should.have.property('bindings');
      var strResponse = JSON.stringify(response);
      //console.log(strResponse);
      strResponse.should.containEql('Person 1');
      strResponse.should.containEql('Person 2');*/
      /*response.results.bindings[0].should.have.property('personName1');
      response.results.bindings[0].personName1.should.have.property('value');
      response.results.bindings[0].personName1.value.should.equal('Person 1');
      response.results.bindings[0].should.have.property('personName2');
      response.results.bindings[0].personName2.should.have.property('value');
      response.results.bindings[0].personName2.value.should.equal('Person 2');*/
      //console.log(JSON.stringify(response, null, 4))
      /*done();
    }, done);
  });*/

  it('should delete the graph', function(done){
    this.timeout(3000);
    db.graphs.remove().
    result(function(response){
      done();
    }, done);
  });
});
