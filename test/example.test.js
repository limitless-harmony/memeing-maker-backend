import chai from 'chai';
import http from 'chai-http';
import app from '../src/server';

const { expect } = require('chai');

chai.use(http);

describe('Example title', () => {
  it('Test case goes here', (done) => {
    const str = 'Hello guys!';
    expect(str).to.equal('Hello guys!');
    done();
  });
});
