import mongoose, { ObjectId } from 'mongoose';
import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';

import request from 'supertest';
const req = request(server);

import { Trial } from './trials.model';
import { Site } from '../sites/sites.model';
import { Group } from './groups/groups.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Patient } from '../patients/patients.model';

beforeAll(async () => {
  await connectToDB('trialstestdb');
});

describe('GET /api/trials/:trialid', () => {
  it('should get a Trial by id', async () => {
    const trial = await Trial.create({
      name: faker.name.firstName(),
    });
    const id = trial._id.toString();

    const response = await req.get(`/api/trials/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should return a 400 when ObjectId is invalid or missing', async () => {
    await req.get('/api/trials/69').expect(400);
  });

  it('should return a 404 when ObjectId not found', async () => {
    await req.get(`/api/trials/${mongoose.Types.ObjectId()}`).expect(404);
  });
});

describe('POST /api/trials/', () => {
  it('should create an Trial with only required fields', async () => {
    const trial = {
      name: faker.name.firstName(),
    };

    const res = await req.post('/api/trials/').send(trial);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(trial.name);
    expect(res.body.sites).toStrictEqual([]);
  });

  it('should return a 400 when trying to create an Trial without required fields', async () => {
    await req.post('/api/trials/').send({}).expect(400);
  });
});

describe('PUT /api/trials/:trialid', () => {
  var trialid: string;

  var siteid: ObjectId,
    groupid: ObjectId,
    teamMemberid: ObjectId,
    patientid: ObjectId;

  beforeAll(async () => {
    const group = await Group.create({
      name: 'Test Trial',
    });
    groupid = group._id;

    const site = await Site.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    siteid = site._id;

    const patient = await Patient.create({
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: true,
    });
    patientid = patient._id;

    const teamMember = await TeamMember.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    teamMemberid = teamMember._id.toString();

    const trial = await Trial.create({
      name: faker.name.firstName(),
      endpointResults: 'test endpoint results',
      protocols: [{ name: 'test protocol' }],
      permissions: ['test perm1'],
      blinded: true,
      sites: [siteid],
      teamMembers: [teamMemberid],
      groups: [groupid],
      patients: [patientid],
    });
    trialid = trial._id.toString();
  });

  it('should reject an invalid update operation', async () => {
    var reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant trial', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 'Test Trial',
    };

    await req
      .put(`/api/trials/${mongoose.Types.ObjectId()}`)
      .send(reqBody)
      .expect(404);
  });

  it('should reject an invalid payload', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 12,
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(400);
  });

  it('should rename', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 'New Test Trial',
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.name).toBe(reqBody.payload);
  });

  it('should update endpointResults', async () => {
    var reqBody = {
      operation: 'update endpointResults',
      payload: 'new endpoint results',
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.endpointResults).toStrictEqual(reqBody.payload);
  });

  it('should add protocols', async () => {
    var reqBody = {
      operation: 'add protocols',
      payload: [{ name: 'new test protocol' }],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.protocols).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: reqBody.payload[0].name,
        }),
      ])
    );
  });

  it('should remove protocols', async () => {
    var reqBody = {
      operation: 'remove protocols',
      payload: [{ name: 'test protocol' }],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.protocols).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: reqBody.payload[0].name,
        }),
      ])
    );
  });

  it('should set protocols', async () => {
    var reqBody = {
      operation: 'set protocols',
      payload: [{ name: 'another new test protocol' }],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.protocols).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: reqBody.payload[0].name,
        }),
      ])
    );
  });

  it('should add permissions', async () => {
    var reqBody = {
      operation: 'add permissions',
      payload: ['test perm2'],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.permissions).toContain(reqBody.payload[0]);
  });

  it('should remove permissions', async () => {
    var reqBody = {
      operation: 'remove permissions',
      payload: ['test perm1'],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.permissions).not.toContain(reqBody.payload[0]);
  });

  it('should set permissions', async () => {
    var reqBody = {
      operation: 'set permissions',
      payload: ['test perm3'],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.permissions[0]).toBe(reqBody.payload[0]);
  });

  it('should update blinded', async () => {
    var reqBody = {
      operation: 'update blinded',
      payload: false,
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.blinded).toBe(reqBody.payload);
  });

  it('should add teamMembers', async () => {
    const newteammember = await TeamMember.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    const newteammemberid = newteammember._id;

    var reqBody = {
      operation: 'add teamMembers',
      payload: [newteammemberid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.teamMembers).toContainEqual(reqBody.payload[0]);
  });

  it('should add sites', async () => {
    const newsite = await Site.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
    });
    const newsiteid = newsite._id;

    var reqBody = {
      operation: 'add sites',
      payload: [newsiteid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.sites).toContainEqual(reqBody.payload[0]);
  });

  it('should add groups', async () => {
    const newgroup = await Group.create({
      name: faker.name.firstName(),
    });
    const newgroupid = newgroup._id;

    var reqBody = {
      operation: 'add groups',
      payload: [newgroupid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.groups).toContainEqual(reqBody.payload[0]);
  });

  it('should add patients', async () => {
    const newpatient = await Patient.create({
      dccid: 'difffakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/diff/consent/form',
      screenFail: true,
    });
    const newpatientid = newpatient._id;

    var reqBody = {
      operation: 'add patients',
      payload: [newpatientid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.patients).toContainEqual(reqBody.payload[0]);
  });

  it('should remove teamMembers', async () => {
    var reqBody = {
      operation: 'remove teamMembers',
      payload: [teamMemberid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.teamMembers).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove sites', async () => {
    var reqBody = {
      operation: 'remove sites',
      payload: [siteid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.sites).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove groups', async () => {
    var reqBody = {
      operation: 'remove groups',
      payload: [groupid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.groups).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove patients', async () => {
    var reqBody = {
      operation: 'remove patients',
      payload: [patientid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await Trial.findById(trialid).lean();
    expect(updatedTrial.patients).not.toContainEqual(reqBody.payload[0]);
  });
});

afterAll(async () => {
  await dropDB();
});
