import request from 'supertest';
import mongoose from 'mongoose';

import {
  CentralCoordinatingCenter,
  ICentralCoordinatingCenter,
} from '../ccc.model';

import server from '../../config/server';
import { connectToDB, dropDB } from '../../config/db';

beforeEach((done) => {
  connectToDB().then(() => done());
});

describe('GET /api/CCC/:cccid', () => {
  it('should get a Central Coordindating Center by id', async () => {
    const ccc: ICentralCoordinatingCenter =
      await CentralCoordinatingCenter.create({
        name: 'Test CCC',
      });
    const id = ccc._id.toString();

    await request(server)
      .get(`/api/cccs/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.body._id).toEqual(id);
      });
  });

  it('should return a 400 when ObjectId in invalid or missing', async () => {
    await request(server).get('/api/cccs/69').expect(404);
  });

  it('should return a 404 when ObjectId not found', async () => {
    await request(server)
      .get(`/api/cccs/${mongoose.Types.ObjectId()}`)
      .expect(404);
  });
});

afterEach((done) => {
  dropDB().then(() => done());
});
