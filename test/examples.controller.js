import chai from 'chai';
import request from 'supertest';
import Server from '../server';
import { isMainThread } from 'worker_threads';

const expect = chai.expect;

describe("Auth",() => {
  it("should return token after login",() => {
    request(Server)
      .get
  })
})

// describe('Examples', () => {
//   it('should get all examples', () =>
//     request(Server)
//       .get('/api/examples')
//       .expect('Content-Type', /json/)
//       .then(r => {
//         expect(r.body)
//           .to.be.an.an('array')
//           .of.length(2);
//       }));

//   it('should add a new example', () =>
//     request(Server)
//       .post('/api/examples')
//       .send({ name: 'test' })
//       .expect('Content-Type', /json/)
//       .then(r => {
//         expect(r.body)
//           .to.be.an.an('object')
//           .that.has.property('name')
//           .equal('test');
//       }));

//   it('should get an example by id', () =>
//     request(Server)
//       .get('/api/examples/2')
//       .expect('Content-Type', /json/)
//       .then(r => {
//         expect(r.body)
//           .to.be.an.an('object')
//           .that.has.property("name")
//           .equal('test');
//       }));
// });
