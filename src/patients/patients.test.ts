import mongoose, { NativeError, ObjectId } from 'mongoose';
import faker from 'faker';

import server from '../../config/server';
import { connectToDB, dropDB } from '../../config/db';

import request from 'supertest';
const req = request(server);

import { Patient, IPatient } from '../patients.model';
import { Trial } from '../../trials/trials.model';
import { Site } from '../../sites/sites.model';
import { Group } from '../../trials/groups/groups.model';
import { Endpoint } from '../../endpoints/endpoints.model';

beforeAll(async () => {
  await connectToDB('patienttestdb');
});

describe('GET /api/patients/:patientid', () => {
  it('should get an Patient by id', async () => {
    const patient = await Patient.create({
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: false,
    });
    const id = patient._id.toString();

    const response = await req.get(`/api/patients/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should return a 400 when ObjectId is invalid or missing', async () => {
    await req.get('/api/patients/69').expect(400);
  });

  it('should return a 404 when ObjectId not found', async () => {
    await req.get(`/api/patients/${mongoose.Types.ObjectId()}`).expect(404);
  });
});

describe('POST /api/patients/', () => {
  it('should create an Patient with only required fields', async () => {
    const patient = {
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: false,
    };

    const res = await req.post('/api/patients/').send(patient);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(patient.name);
    expect(res.body.endpoints).toStrictEqual([]);
  });

  it('should return a 400 when trying to create an Patient without required fields', async () => {
    await req
      .post('/api/patients/')
      .send({
        dccid: 'fakedccid',
        // name: faker.name.firstName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        phoneNumber: faker.datatype.number({
          min: 1111111111,
          max: 9999999999,
        }),
        consentForm: 'fake/url/to/consent/form',
        screenFail: false,
      })
      .expect(400);
  });
});

describe('PUT /api/patients/:patientid', () => {
  var patientid: string;
  var endpointid: string;

  var siteid: ObjectId, trialid: ObjectId, groupid: ObjectId;

  beforeAll(async () => {
    const patient = await Patient.create({
      dccid: 'newfakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/diff/consent/form',
      screenFail: true,
      documents: ['test document'],
    });
    patientid = patient._id.toString();

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

    const endpoint = await Endpoint.create({
      name: 'Test Endpoint',
      date: Date.now(),
      description: 'Test Description',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
    });
    endpointid = endpoint._id.toString();

    await Patient.findById(patientid, (err: NativeError, patient: IPatient) => {
      patient.endpoints.push(endpoint._id);
      patient.save();
    });
  });

  it('should reject an invalid update operation', async () => {
    var reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant patient', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 'Test Patient',
    };

    await req
      .put(`/api/patients/${mongoose.Types.ObjectId()}`)
      .send(reqBody)
      .expect(404);
  });

  it('should rename', async () => {
    var reqBody = {
      operation: 'rename',
      payload: 'New Test Patient',
    };
    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.name).toBe(reqBody.payload);
      }
    );
  });

  it('should update address', async () => {
    var reqBody = {
      operation: 'update address',
      payload: faker.address.streetAddress(),
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.address).toStrictEqual(reqBody.payload);
      }
    );
  });

  it('should update email', async () => {
    var reqBody = {
      operation: 'update email',
      payload: faker.internet.email(),
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.email).toBe(reqBody.payload);
      }
    );
  });

  it('should update phoneNumber', async () => {
    var reqBody = {
      operation: 'update phoneNumber',
      payload: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.phoneNumber).toBe(reqBody.payload);
      }
    );
  });

  it('should add documents', async () => {
    var reqBody = {
      operation: 'add documents',
      payload: ['new test document'],
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.documents).toContain(reqBody.payload[0]);
      }
    );
  });

  it('should remove documents', async () => {
    var reqBody = {
      operation: 'remove documents',
      payload: ['test document'],
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.documents).not.toContain(reqBody.payload[0]);
      }
    );
  });

  it('should add endpoints', async () => {
    const newendpoint = await Endpoint.create({
      name: 'New Test Endpoint',
      date: Date.now(),
      description: 'New Test Description',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
    });
    var reqBody = {
      operation: 'add endpoints',
      payload: [newendpoint._id],
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.endpoints).toContainEqual(reqBody.payload[0]);
      }
    );
  });

  it('should remove endpoints', async () => {
    var reqBody = {
      operation: 'remove endpoints',
      payload: [endpointid],
    };

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.endpoints).not.toContain(reqBody.payload[0]);
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

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.site.toString()).toBe(newsiteid);
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

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.group.toString()).toBe(newgroupid);
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

    await req.put(`/api/patients/${patientid}`).send(reqBody).expect(204);

    await Patient.findById(
      patientid,
      (err: NativeError, updatedPatient: IPatient) => {
        expect(updatedPatient.trial.toString()).toBe(newtrialid);
      }
    );
  });
});

afterAll(async () => {
  await dropDB();
});
