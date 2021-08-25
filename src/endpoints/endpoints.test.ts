import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';
import { ObjectId } from '../utils/utils';

import request from 'supertest';
const req = request(server);

import { EndpointModel, TrialModel, SiteModel, GroupModel, PatientModel } from '../models';

let siteid: ObjectId, trialid: ObjectId, groupid: ObjectId, patientid: ObjectId;

beforeAll(async () => {
  await connectToDB('endpointtestdb');

  const trial = await TrialModel.create({
    name: 'Test Trial',
  });
  trialid = trial._id.toString();

  const site = await SiteModel.create({
    name: 'Test Site',
    address: faker.address.streetAddress(),
  });
  siteid = site._id.toString();

  const group = await GroupModel.create({
    name: 'Test Group',
  });
  groupid = group._id.toString();

  const patient = await PatientModel.create({
    dccid: 'fakedccid',
    name: faker.name.firstName(),
    address: faker.address.streetAddress(),
    email: faker.internet.email(),
    phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    consentForm: 'fake/url/to/consent/form',
    screenFail: false,
  });
  patientid = patient._id.toString();
});

describe('GET /api/endpoints/:endpointid', () => {
  it('should get an Endpoint by id', async () => {
    const endpoint = await EndpointModel.create({
      name: 'Test Endpoint',
      date: Date.now(),
      description: 'This is a test endpoint',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
    });
    const id = endpoint._id.toString();

    const response = await req.get(`/api/endpoints/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should return a 400 when ObjectId is invalid or missing', async () => {
    await req.get('/api/endpoints/69').expect(400);
  });

  it('should return a 404 when ObjectId not found', async () => {
    await req.get(`/api/endpoints/${ObjectId()}`).expect(404);
  });
});

describe('POST /api/endpoints/', () => {
  it('should create an Endpoint with only required fields', async () => {
    const endpoint = {
      name: 'Test Endpoint',
      date: Date.now(),
      description: 'This is a test endpoint',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
    };

    const res = await req.post('/api/endpoints/').send(endpoint);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(endpoint.name);
    expect(res.body.documents).toStrictEqual([]);
  });

  it('should return a 400 when trying to create an Endpoint without required fields', async () => {
    await req
      .post('/api/endpoints/')
      .send({
        // name: 'Test Endpoint',
        date: Date.now(),
        description: 'This is a test endpoint',
        site: siteid,
        trial: trialid,
        group: groupid,
        patient: patientid,
      })
      .expect(400);
  });
});

describe('PUT /api/endpoints/:endpointid', () => {
  let endpointid: ObjectId;

  beforeAll(async () => {
    const endpoint = await EndpointModel.create({
      name: 'Test Endpoint',
      date: Date.now(),
      description: 'This is a test endpoint',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
      score: 8,
      documents: ['test document'],
    });
    endpointid = endpoint._id;
  });

  it('should reject an invalid update operation', async () => {
    let reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant endpoint', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'Test Endpoint',
    };

    await req
      .put(`/api/endpoints/${ObjectId()}`)
      .send(reqBody)
      .expect(404);
  });

  it('should rename', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'New Test Endpoint',
    };
    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.name).toBe(reqBody.payload);
  });

  it('should reject an invalid payload', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 12,
    };
    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(400);
  });

  it('should change date', async () => {
    let reqBody = {
      operation: 'change date',
      payload: new Date(),
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.date).toStrictEqual(reqBody.payload);
  });

  it('should change description', async () => {
    let reqBody = {
      operation: 'change description',
      payload: 'new test description',
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.description).toBe(reqBody.payload);
  });

  it('should update score', async () => {
    let reqBody = {
      operation: 'update score',
      payload: '10',
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.score).toBe(reqBody.payload);
  });

  it('should add documents', async () => {
    let reqBody = {
      operation: 'add documents',
      payload: ['new test document'],
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.documents).toContain(reqBody.payload[0]);
  });

  it('should remove documents', async () => {
    let reqBody = {
      operation: 'remove documents',
      payload: ['test document'],
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.documents).not.toContain(reqBody.payload[0]);
  });

  it('should change site', async () => {
    const site = await SiteModel.create({
      name: 'New Test Site',
      address: faker.address.streetAddress(),
    });
    let newsiteid = site._id.toString();

    let reqBody = {
      operation: 'change site',
      payload: newsiteid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.site.toString()).toBe(reqBody.payload);
  });

  it('should change group', async () => {
    const group = await GroupModel.create({
      name: 'New Test Group',
    });
    let newgroupid = group._id.toString();

    let reqBody = {
      operation: 'change group',
      payload: newgroupid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.group.toString()).toBe(newgroupid);
  });

  it('should change trial', async () => {
    const trial = await TrialModel.create({
      name: 'Test Trial',
    });
    let newtrialid = trial._id.toString();

    let reqBody = {
      operation: 'change trial',
      payload: newtrialid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.trial.toString()).toBe(newtrialid);
  });

  it('should change patient', async () => {
    const patient = await PatientModel.create({
      dccid: 'difffakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/diff/consent/form',
      screenFail: true,
    });
    let newpatientid = patient._id.toString();

    let reqBody = {
      operation: 'change patient',
      payload: newpatientid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    const updatedEndpoint = await EndpointModel.findById(endpointid).lean();
    expect(updatedEndpoint.patient.toString()).toBe(newpatientid);
  });
});

afterAll(async () => {
  await dropDB();
});
