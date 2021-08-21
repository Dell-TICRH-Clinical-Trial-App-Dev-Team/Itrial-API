import mongoose, { ObjectId } from 'mongoose';
import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';

import request from 'supertest';
const req = request(server);

import { Site } from './sites.model';
import { Trial } from '../trials/trials.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Ccc } from '../cccs/cccs.model';

beforeAll(async () => {
  await connectToDB('sitetestdb');
});

describe('GET /api/sites/:siteid', () => {
  it('should get a Site by id', async () => {
    const site = await Site.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    const id = site._id.toString();

    const response = await req.get(`/api/sites/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should return a 400 when ObjectId is invalid or missing', async () => {
    await req.get('/api/sites/69').expect(400);
  });

  it('should return a 404 when ObjectId not found', async () => {
    await req.get(`/api/sites/${mongoose.Types.ObjectId()}`).expect(404);
  });
});

describe('POST /api/sites/', () => {
  it('should create a Site with only a name', async () => {
    const mockSite = {
      name: 'Test Site',
      address: faker.address.streetAddress(),
    };

    const res = await req.post('/api/sites/').send(mockSite);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(mockSite.name);
    expect(res.body.trials).toStrictEqual([]);
    expect(res.body.teamMembers).toStrictEqual([]);
    expect(res.body.cccs).toStrictEqual([]);
  });

  it('should return a 400 when trying to create a Site without a name or address', async () => {
    await req.post('/api/sites/').send({ name: 'test site' }).expect(400);
    await req
      .post('/api/sites/')
      .send({ address: faker.address.streetAddress() })
      .expect(400);
  });
});

describe('PUT /api/sites/:siteid', () => {
  let siteid: string;
  let cccid: ObjectId;
  let trialid: ObjectId;
  let teamMemberid: ObjectId;

  beforeAll(async () => {
    const trial = await Trial.create({
      name: 'Test Trial',
    });
    trialid = trial._id;

    const ccc = await Ccc.create({
      name: 'Test Ccc',
    });
    cccid = ccc._id;

    const teamMember = await TeamMember.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      permissions: ['test'],
    });
    teamMemberid = teamMember._id;

    const site = await Site.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
      trials: [trialid],
      cccs: [cccid],
      teamMembers: [teamMemberid],
    });
    siteid = site._id.toString();
  });

  it('should reject an invalid update operation', async () => {
    let reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant site', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'Test Site',
    };

    await req
      .put(`/api/sites/${mongoose.Types.ObjectId()}`)
      .send(reqBody)
      .expect(404);
  });

  it('should reject an invalid payload', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 12,
    };
    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(400);
  });

  it('should rename', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'New Test Site',
    };
    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.name).toBe(reqBody.payload);
  });

  it('should update address', async () => {
    let reqBody = {
      operation: 'update address',
      payload: faker.address.streetAddress(),
    };
    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.address).toBe(reqBody.payload);
  });

  it('should remove trials', async () => {
    let reqBody = {
      operation: 'remove trials',
      payload: [trialid],
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.trials).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove cccs', async () => {
    let reqBody = {
      operation: 'remove cccs',
      payload: [cccid],
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.cccs).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove teamMembers', async () => {
    let reqBody = {
      operation: 'remove teamMembers',
      payload: [teamMemberid],
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.teamMembers).not.toContainEqual(reqBody.payload[0]);
  });

  it('should add trials', async () => {
    const trial = await Trial.create({
      name: 'Test Trial',
    });
    const newtrialid = trial._id;

    let reqBody = {
      operation: 'add trials',
      payload: [newtrialid],
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.trials).toContainEqual(reqBody.payload[0]);
  });

  it('should add cccs', async () => {
    const ccc = await Ccc.create({
      name: 'Test Ccc',
    });
    const newcccid = ccc._id;

    let reqBody = {
      operation: 'add cccs',
      payload: [newcccid],
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.cccs).toContainEqual(reqBody.payload[0]);
  });

  it('should add team members', async () => {
    const teamMember = await TeamMember.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      permissions: ['test'],
    });
    const newteammemberid = teamMember._id;

    let reqBody = {
      operation: 'add teamMembers',
      payload: [newteammemberid],
    };

    await req.put(`/api/sites/${siteid}`).send(reqBody).expect(204);

    const updatedSite = await Site.findById(siteid).lean();
    expect(updatedSite.teamMembers).toContainEqual(reqBody.payload[0]);
  });
});

afterAll(async () => {
  await dropDB();
});
