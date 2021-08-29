import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';
import { ObjectId } from '../utils/utils';

import request from 'supertest';
const req = request(server);

import {
  TrialModel,
  SiteModel,
  GroupModel,
  TeamMemberModel,
  PatientModel,
} from '../models';

beforeAll(async () => {
  await connectToDB('trialstestdb');
});

describe('GET /api/trials/:trialid', () => {
  it('should get a Trial by id', async () => {
    const trial = await TrialModel.create({
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
    await req.get(`/api/trials/${ObjectId()}`).expect(404);
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
  let trialid: string;

  let siteid: ObjectId,
    groupid: ObjectId,
    cccid: ObjectId,
    teamMemberid: ObjectId,
    patientid: ObjectId;

  beforeAll(async () => {
    const group = await GroupModel.create({
      name: 'Test Trial',
    });
    groupid = group._id;

    const site = await SiteModel.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    siteid = site._id;

    const patient = await PatientModel.create({
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: true,
    });
    patientid = patient._id;

    const ccc = await TeamMemberModel.create({
      name: faker.name.firstName() + ' (CCC)',
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    cccid = ccc._id.toString();

    const teamMember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    teamMemberid = teamMember._id.toString();

    const trial = await TrialModel.create({
      name: faker.name.firstName(),
      endpointResults: 'test endpoint results',
      protocols: [{ name: 'test protocol' }],
      blinded: true,
      sites: [siteid],
      teamMembers: [teamMemberid],
      groups: [groupid],
      patients: [patientid],
    });
    trialid = trial._id.toString();
  });

  it('should reject an invalid update operation', async () => {
    let reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant trial', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'Test Trial',
    };

    await req.put(`/api/trials/${ObjectId()}`).send(reqBody).expect(404);
  });

  it('should reject an invalid payload', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 12,
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(400);
  });

  it('should rename', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'New Test Trial',
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.name).toBe(reqBody.payload);
  });

  it('should set startDate', async () => {
    let reqBody = {
      operation: 'set startDate',
      payload: new Date(),
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(new Date(updatedTrial.startDate)).toStrictEqual(reqBody.payload);
  });

  it('should set endDate', async () => {
    let reqBody = {
      operation: 'set endDate',
      payload: new Date(),
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(new Date(updatedTrial.endDate)).toStrictEqual(reqBody.payload);
  });

  it('should update endpointResults', async () => {
    let reqBody = {
      operation: 'update endpointResults',
      payload: 'new endpoint results',
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.endpointResults).toStrictEqual(reqBody.payload);
  });

  it('should add protocols', async () => {
    let reqBody = {
      operation: 'add protocols',
      payload: [{ name: 'new test protocol' }],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.protocols).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: reqBody.payload[0].name,
        }),
      ])
    );
  });

  it('should remove protocols', async () => {
    let reqBody = {
      operation: 'remove protocols',
      payload: [{ name: 'test protocol' }],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.protocols).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: reqBody.payload[0].name,
        }),
      ])
    );
  });

  it('should set protocols', async () => {
    let reqBody = {
      operation: 'set protocols',
      payload: [{ name: 'another new test protocol' }],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.protocols).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: reqBody.payload[0].name,
        }),
      ])
    );
  });

  it('should update blinded', async () => {
    let reqBody = {
      operation: 'update blinded',
      payload: false,
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.blinded).toBe(reqBody.payload);
  });

  it('should add teamMembers', async () => {
    const newteammember = await TeamMemberModel.create({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    const newteammemberid = newteammember._id;

    let reqBody = {
      operation: 'add teamMembers',
      payload: [newteammemberid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.teamMembers).toContainEqual(reqBody.payload[0]);
  });

  it('should add cccs', async () => {
    const newccc = await TeamMemberModel.create({
      name: faker.name.firstName() + ' (CCC 2)',
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    });
    const newcccid = newccc._id;

    let reqBody = {
      operation: 'add cccs',
      payload: [newcccid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.cccs).toContainEqual(reqBody.payload[0]);
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

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.sites).toContainEqual(reqBody.payload[0]);
  });

  it('should add groups', async () => {
    const newgroup = await GroupModel.create({
      name: faker.name.firstName(),
    });
    const newgroupid = newgroup._id;

    let reqBody = {
      operation: 'add groups',
      payload: [newgroupid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.groups).toContainEqual(reqBody.payload[0]);
  });

  it('should add patients', async () => {
    const newpatient = await PatientModel.create({
      dccid: 'difffakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/diff/consent/form',
      screenFail: true,
    });
    const newpatientid = newpatient._id;

    let reqBody = {
      operation: 'add patients',
      payload: [newpatientid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.patients).toContainEqual(reqBody.payload[0]);
  });

  it('should remove teamMembers', async () => {
    let reqBody = {
      operation: 'remove teamMembers',
      payload: [teamMemberid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.teamMembers).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove cccs', async () => {
    let reqBody = {
      operation: 'remove teamMembers',
      payload: [cccid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.cccs).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove sites', async () => {
    let reqBody = {
      operation: 'remove sites',
      payload: [siteid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.sites).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove groups', async () => {
    let reqBody = {
      operation: 'remove groups',
      payload: [groupid],
    };
    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.groups).not.toContainEqual(reqBody.payload[0]);
  });

  it('should remove patients', async () => {
    let reqBody = {
      operation: 'remove patients',
      payload: [patientid],
    };

    await req.put(`/api/trials/${trialid}`).send(reqBody).expect(204);

    const updatedTrial = await TrialModel.findById(trialid).lean();
    expect(updatedTrial.patients).not.toContainEqual(reqBody.payload[0]);
  });
});

afterAll(async () => {
  await dropDB();
});
