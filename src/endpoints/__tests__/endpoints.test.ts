import mongoose, { NativeError, ObjectId } from 'mongoose';
import faker from 'faker';

import server from '../../config/server';
import { connectToDB, dropDB } from '../../config/db';

import request from 'supertest';
const req = request(server);

import { Endpoint, IEndpoint } from '../endpoints.model';
import { Trial } from '../../trials/trials.model';
import { Site } from '../../sites/sites.model';
import { Group } from '../../trials/groups/groups.model';
import { Patient } from '../../patients/patients.model';

var siteid: ObjectId, trialid: ObjectId, groupid: ObjectId, patientid: ObjectId;

beforeAll(async () => {
  await connectToDB('endpointtestdb');

  const trial = await Trial.create({
    name: 'Test Trial',
  });
  trialid = trial._id.toString();

  const site = await Site.create({
    name: 'Test Site',
    address: faker.address.streetAddress(),
  });
  siteid = site._id.toString();

  const group = await Group.create({
    name: 'Test Group',
  });
  groupid = group._id.toString();

  const patient = await Patient.create({
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
    const endpoint = await Endpoint.create({
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
    await req.get(`/api/endpoints/${mongoose.Types.ObjectId()}`).expect(404);
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
  var endpointid: string;

  beforeAll(async () => {
    const endpoint = await Endpoint.create({
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
    endpointid = endpoint._id.toString();
  });

  it('should return reject an invalid update operation', async () => {
    var reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant endpoint', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 'Test Endpoint',
    };

    await req
      .put(`/api/endpoints/${mongoose.Types.ObjectId()}`)
      .send(reqBody)
      .expect(404);
  });

  it('should rename', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 'New Test Endpoint',
    };
    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.name).toBe(reqBody.payload);
      }
    );
  });

  it('should change date', async () => {
    var reqBody = {
      operation: 'change date',
      payload: new Date(),
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.date).toStrictEqual(reqBody.payload);
      }
    );
  });

  it('should change description', async () => {
    var reqBody = {
      operation: 'change description',
      payload: 'new test description',
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.description).toBe(reqBody.payload);
      }
    );
  });

  it('should update score', async () => {
    var reqBody = {
      operation: 'update score',
      payload: '10',
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.score).toBe(reqBody.payload);
      }
    );
  });

  it('should add documents', async () => {
    var reqBody = {
      operation: 'add documents',
      payload: ['new test document'],
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.documents).toContain(reqBody.payload[0]);
      }
    );
  });

  it('should remove documents', async () => {
    var reqBody = {
      operation: 'remove documents',
      payload: ['test document'],
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.documents).not.toContain(reqBody.payload[0]);
      }
    );
  });

  it('should change site', async () => {
    const site = await Site.create({
      name: 'New Test Site',
      address: faker.address.streetAddress(),
    });
    var newsiteid = site._id.toString();

    var reqBody = {
      operation: 'change site',
      payload: newsiteid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.site.toString()).toBe(newsiteid);
      }
    );
  });

  it('should change group', async () => {
    const group = await Group.create({
      name: 'New Test Group',
    });
    var newgroupid = group._id.toString();

    var reqBody = {
      operation: 'change group',
      payload: newgroupid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.group.toString()).toBe(newgroupid);
      }
    );
  });

  it('should change trial', async () => {
    const trial = await Trial.create({
      name: 'Test Trial',
    });
    var newtrialid = trial._id.toString();

    var reqBody = {
      operation: 'change trial',
      payload: newtrialid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.trial.toString()).toBe(newtrialid);
      }
    );
  });

  it('should change patient', async () => {
    const patient = await Patient.create({
      dccid: 'difffakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/diff/consent/form',
      screenFail: true,
    });
    var newpatientid = patient._id.toString();

    var reqBody = {
      operation: 'change patient',
      payload: newpatientid,
    };

    await req.put(`/api/endpoints/${endpointid}`).send(reqBody).expect(204);

    await Endpoint.findById(
      endpointid,
      (err: NativeError, updatedEndpoint: IEndpoint) => {
        expect(updatedEndpoint.patient.toString()).toBe(newpatientid);
      }
    );
  });
});

afterAll(async () => {
  await dropDB();
});
