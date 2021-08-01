import mongoose, { NativeError } from 'mongoose';
import faker from 'faker';

import server from '../../config/server';
import { connectToDB, dropDB } from '../../config/db';

import request from 'supertest';
const req = request(server);

import {
  CentralCoordinatingCenter,
  ICentralCoordinatingCenter,
} from '../ccc.model';
import { Trial } from '../../trials/trials.model';
import { Site } from '../../sites/sites.model';
import { TeamMember } from '../../teamMembers/teamMembers.model';

beforeAll(async () => {
  await connectToDB('ccctestdb');
});

describe('GET /api/cccs/:cccid', () => {
  it('should get a Central Coordindating Center by id', async () => {
    const ccc = await CentralCoordinatingCenter.create({
      name: 'Test CCC',
    });
    const id = ccc._id.toString();

    const response = await req.get(`/api/cccs/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should return a 400 when ObjectId is invalid or missing', async () => {
    await req.get('/api/cccs/69').expect(400);
  });

  it('should return a 404 when ObjectId not found', async () => {
    await req.get(`/api/cccs/${mongoose.Types.ObjectId()}`).expect(404);
  });
});

describe('POST /api/cccs/', () => {
  it('should create a CCC with only a name', async () => {
    const mockCCC = {
      name: 'Test CCC',
    };

    const res = await req.post('/api/cccs/').send(mockCCC);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(mockCCC.name);
    expect(res.body.trials).toStrictEqual([]);
    expect(res.body.teamMembers).toStrictEqual([]);
    expect(res.body.sites).toStrictEqual([]);
  });

  it('should return a 400 when trying to create a CCC without a name', async () => {
    await req.post('/api/cccs/').send({}).expect(400);
  });
});

describe('PUT /api/cccs/:cccid', () => {
  var cccid: string;
  var trialid: string;
  var siteid: string;
  var teamMemberid: string;
  var reqBody: { operation: string; payload: any };

  beforeAll(async () => {
    const trial = await Trial.create({
      name: 'Test Trial',
    });
    trialid = trial._id.toString();

    const site = await Site.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    siteid = site._id.toString();

    const teamMember = await TeamMember.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phone: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      permissions: ['admin'],
    });
    teamMemberid = teamMember._id.toString();

    const ccc = await CentralCoordinatingCenter.create({
      name: 'Test CCC',
      trials: [trialid],
      sites: [siteid],
      teamMembers: [teamMemberid],
    });
    cccid = ccc._id.toString();
  });

  it('should rename CCC', async () => {
    reqBody = {
      operation: 'rename',
      payload: 'New Test CCC',
    };
    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.name).toBe(reqBody.payload);
      }
    );
  });

  it('should remove trials', async () => {
    reqBody = {
      operation: 'remove trials',
      payload: [trialid],
    };

    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.trials.length).toBe(0);
      }
    );
  });

  it('should remove sites', async () => {
    reqBody = {
      operation: 'remove sites',
      payload: [siteid],
    };

    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.sites.length).toBe(0);
      }
    );
  });

  it('should remove teamMembers', async () => {
    reqBody = {
      operation: 'remove teamMembers',
      payload: [teamMemberid],
    };

    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.teamMembers.length).toBe(0);
      }
    );
  });

  it('should add trials', async () => {
    const trial = await Trial.create({
      name: 'Test Trial',
    });
    const newtrialid = trial._id.toString();

    reqBody = {
      operation: 'add trials',
      payload: [newtrialid],
    };

    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.trials.length).toBe(1);
      }
    );
  });

  it('should add sites', async () => {
    const site = await Site.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    const newsiteid = site._id.toString();

    reqBody = {
      operation: 'add sites',
      payload: [newsiteid],
    };

    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.sites.length).toBe(1);
      }
    );
  });

  it('should add team members', async () => {
    const teamMember = await TeamMember.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phone: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      permissions: ['admin'],
    });
    const newteammemberid = teamMember._id.toString();

    reqBody = {
      operation: 'add teamMembers',
      payload: [newteammemberid],
    };

    await req.put(`/api/cccs/${cccid}`).send(reqBody).expect(204);

    await CentralCoordinatingCenter.findById(
      cccid,
      (err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
        expect(updatedCCC.teamMembers.length).toBe(1);
      }
    );
  });
});

afterAll(async () => {
  await dropDB();
});
