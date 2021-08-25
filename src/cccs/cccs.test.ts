import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';
import { ObjectId } from '../utils/utils';

import request from 'supertest';
const req = request(server);

import { CccModel, TrialModel, SiteModel, TeamMemberModel } from '../models';

beforeAll(async () => {
  await connectToDB('ccctestdb');
});

describe('GET /api/cccs/:cccId', () => {
  it('should get a Central Coordindating Center by id', async () => {
    const ccc = await CccModel.create({
      name: 'Test Ccc',
      email: faker.internet.email(),
    });
    const id = ccc._id.toString();

    const response = await req.get(`/api/cccs/id/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should get a Central Coordindating Center by id', async () => {
    const ccc = await CccModel.create({
      name: 'Test Ccc',
      email: faker.internet.email(),
    });
    const email = ccc.email;

    const response = await req.get(`/api/cccs/email/${email}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(email);
  });

  it('should return a 400 when ObjectId or email is invalid or missing', async () => {
    await req.get('/api/cccs/id/69').expect(400);
    await req.get('/api/cccs/email/69').expect(400);
  });

  it('should return a 404 when ObjectId or email not found', async () => {
    await req.get(`/api/cccs/id/${ObjectId()}`).expect(404);
    await req.get(`/api/cccs/email/${faker.internet.email()}`).expect(404);
  });
});

describe('POST /api/cccs/', () => {
  it('should create a Ccc with only required fields', async () => {
    const mockCcc = {
      name: 'Test Ccc',
      email: faker.internet.email(),
    };

    const res = await req.post('/api/cccs/').send(mockCcc);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(mockCcc.name);
    expect(res.body.trials).toStrictEqual([]);
    expect(res.body.teamMembers).toStrictEqual([]);
    expect(res.body.sites).toStrictEqual([]);
  });

  it('should return a 400 when trying to create a Ccc without a name', async () => {
    await req.post('/api/cccs/').send({}).expect(400);
  });
});

describe('PUT /api/cccs/:cccId', () => {
  let cccId: string;
  let trialid: ObjectId;
  let siteid: ObjectId;
  let teamMemberid: ObjectId;

  beforeAll(async () => {
    const trial = await TrialModel.create({
      name: 'Test Trial',
    });
    trialid = trial._id;

    const site = await SiteModel.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    siteid = site._id;

    const teamMember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      permissions: ['admin'],
    });
    teamMemberid = teamMember._id;

    const ccc = await CccModel.create({
      name: 'Test Ccc',
      email: faker.internet.email(),
      trials: [trialid],
      sites: [siteid],
      teamMembers: [teamMemberid],
    });
    cccId = ccc._id.toString();
  });

  it('should reject an invalid update operation', async () => {
    let reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant ccc', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'Test Ccc',
    };

    await req.put(`/api/cccs/id/${ObjectId()}`).send(reqBody).expect(404);
  });

  it('should reject an invalid update payload', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 12,
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(400);
  });

  it('should rename Ccc', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'New Test Ccc',
    };
    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.name).toBe(reqBody.payload);
  });

  it('should remove trials', async () => {
    let reqBody = {
      operation: 'remove trials',
      payload: [trialid],
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.trials).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove sites', async () => {
    let reqBody = {
      operation: 'remove sites',
      payload: [siteid],
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.sites).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove teamMembers', async () => {
    let reqBody = {
      operation: 'remove teamMembers',
      payload: [teamMemberid],
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.teamMembers).not.toContainEqual(reqBody.payload[0]);
  });

  it('should add trials', async () => {
    const trial = await TrialModel.create({
      name: 'Test Trial',
    });
    const newtrialid = trial._id;

    let reqBody = {
      operation: 'add trials',
      payload: [newtrialid],
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.trials).toContainEqual(reqBody.payload[0]);
  });

  it('should add sites', async () => {
    const site = await SiteModel.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    const newsiteid = site._id;

    let reqBody = {
      operation: 'add sites',
      payload: [newsiteid],
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.sites).toContainEqual(reqBody.payload[0]);
  });

  it('should add team members', async () => {
    const teamMember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      permissions: ['admin'],
    });
    const newteammemberid = teamMember._id;

    let reqBody = {
      operation: 'add teamMembers',
      payload: [newteammemberid],
    };

    await req.put(`/api/cccs/id/${cccId}`).send(reqBody).expect(204);

    const updatedCcc = await CccModel.findById(cccId).lean();
    expect(updatedCcc.teamMembers).toContainEqual(reqBody.payload[0]);
  });
});

afterAll(async () => {
  await dropDB();
});
