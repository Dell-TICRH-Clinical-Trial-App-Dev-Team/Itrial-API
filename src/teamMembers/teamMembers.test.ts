import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';
import { ObjectId } from '../utils/utils';

import request from 'supertest';
const req = request(server);

import { TeamMemberModel, TrialModel, SiteModel } from '../models';

beforeAll(async () => {
  await connectToDB('teammembertestdb');
});

describe('GET /api/team-members/', () => {
  it('should get a TeamMember by id', async () => {
    const teamMember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1000000000, max: 9999999999 }),
    });
    const id = teamMember._id.toString();

    const response = await req.get(`/api/team-members/id/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should get a TeamMember by email', async () => {
    const teamMember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1000000000, max: 9999999999 }),
    });
    const email = teamMember.email;

    const response = await req.get(`/api/team-members/email/${email}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(email);
  });

  it('should return a 400 when ObjectId or email is invalid or missing', async () => {
    await req.get('/api/team-members/id/69').expect(400);
    await req.get('/api/team-members/email/69').expect(400);
  });

  it('should return a 404 when ObjectId or email not found', async () => {
    await req.get(`/api/team-members/id/${ObjectId()}`).expect(404);
    await req
      .get(`/api/team-members/email/${faker.internet.email()}`)
      .expect(404);
  });
});

describe('POST /api/team-members/', () => {
  it('should create an TeamMember with only required fields', async () => {
    const teamMember = {
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    };

    const res = await req.post('/api/team-members/').send(teamMember);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(teamMember.name);
    expect(res.body.trials).toStrictEqual([]);
  });

  it('should return a 400 when trying to create an TeamMember without required fields', async () => {
    await req
      .post('/api/team-members/')
      .send({
        // name: faker.name.firstName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        phoneNumber: faker.datatype.number({
          min: 1111111111,
          max: 9999999999,
        }),
      })
      .expect(400);
  });
});

describe('PUT /api/team-members/:teamMemberid', () => {
  let teamMemberid: string;
  let siteid: ObjectId, trialid: ObjectId, cccid: ObjectId;

  beforeAll(async () => {
    const trial = await TrialModel.create({
      name: 'Test Trial',
      status: 'pending',
    });
    trialid = trial._id;

    const site = await SiteModel.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    siteid = site._id;

    const ccc = await TeamMemberModel.create({
      name: faker.name.firstName() + ' (CCC)',
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    cccid = ccc._id;

    const teamMember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      trials: [trialid],
      sites: [siteid],
      ccc: cccid,
    });
    teamMemberid = teamMember._id.toString();
  });

  it('should reject an invalid update operation', async () => {
    let reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(400);
  });

  it('should not update a nonexistant teamMember', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'Test TeamMember',
    };

    await req
      .put(`/api/team-members/id/${ObjectId()}`)
      .send(reqBody)
      .expect(404);
  });

  it('should reject an invalid payload', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 12,
    };
    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(400);
  });

  it('should rename', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'New Test TeamMember',
    };
    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.name).toBe(reqBody.payload);
  });

  it('should update address', async () => {
    let reqBody = {
      operation: 'update address',
      payload: faker.address.streetAddress(),
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.address).toStrictEqual(reqBody.payload);
  });

  it('should update email', async () => {
    let reqBody = {
      operation: 'update email',
      payload: faker.internet.email(),
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.email).toBe(reqBody.payload);
  });

  it('should update phoneNumber', async () => {
    let reqBody = {
      operation: 'update phoneNumber',
      payload: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.phoneNumber).toBe(reqBody.payload);
  });

  it('should set the ccc', async () => {
    const newccc = await TeamMemberModel.create({
      name: faker.name.firstName() + ' (CCC 2)',
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    const newcccid = newccc._id;

    let reqBody = {
      operation: 'set ccc',
      payload: [newcccid],
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.ccc).toEqual(reqBody.payload[0]);
  });

  it('should add sites', async () => {
    const newsite = await SiteModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
    });
    const newsiteid = newsite._id;

    let reqBody = {
      operation: 'add sites',
      payload: [newsiteid],
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.sites).toContainEqual(reqBody.payload[0]);
  });

  it('should add trials', async () => {
    const newtrial = await TrialModel.create({
      name: faker.name.firstName(),
      status: 'ended',
    });
    const newtrialid = newtrial._id;

    let reqBody = {
      operation: 'add trials',
      payload: [newtrialid],
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.trials).toContainEqual(reqBody.payload[0]);
  });

  it('should remove sites', async () => {
    let reqBody = {
      operation: 'remove sites',
      payload: [siteid],
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.sites).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove trials', async () => {
    let reqBody = {
      operation: 'remove trials',
      payload: [trialid],
    };

    await req
      .put(`/api/team-members/id/${teamMemberid}`)
      .send(reqBody)
      .expect(204);

    const updatedTeamMember = await TeamMemberModel.findById(
      teamMemberid
    ).lean();
    expect(updatedTeamMember.trials).not.toContainEqual(reqBody.payload[0]);
  });
});

afterAll(async () => {
  await dropDB();
});
