const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Component = require('../models/Component');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Component.deleteMany({});
  await User.deleteMany({});
});

describe('Components API', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Create a test user
    testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    await testUser.save();

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/components', () => {
    it('should return empty array when no components exist', async () => {
      const response = await request(app)
        .get('/api/components')
        .expect(200);

      expect(response.body.components).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return components with pagination', async () => {
      // Create test components
      const components = [
        {
          name: 'TestButton',
          type: 'button',
          description: 'Test button component',
          createdBy: testUser._id
        },
        {
          name: 'TestInput',
          type: 'input',
          description: 'Test input component',
          createdBy: testUser._id
        }
      ];

      await Component.insertMany(components);

      const response = await request(app)
        .get('/api/components')
        .expect(200);

      expect(response.body.components).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter components by type', async () => {
      const components = [
        {
          name: 'TestButton',
          type: 'button',
          description: 'Test button component',
          createdBy: testUser._id
        },
        {
          name: 'TestInput',
          type: 'input',
          description: 'Test input component',
          createdBy: testUser._id
        }
      ];

      await Component.insertMany(components);

      const response = await request(app)
        .get('/api/components?type=button')
        .expect(200);

      expect(response.body.components).toHaveLength(1);
      expect(response.body.components[0].type).toBe('button');
    });
  });

  describe('POST /api/components', () => {
    it('should create a new component with valid data', async () => {
      const componentData = {
        name: 'NewButton',
        type: 'button',
        description: 'A new button component',
        props: [
          {
            name: 'children',
            type: 'string',
            required: true,
            description: 'Button text'
          }
        ],
        tags: ['button', 'ui']
      };

      const response = await request(app)
        .post('/api/components')
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData)
        .expect(201);

      expect(response.body.name).toBe('NewButton');
      expect(response.body.type).toBe('button');
      expect(response.body.createdBy).toBe(testUser._id.toString());
    });

    it('should require authentication', async () => {
      const componentData = {
        name: 'NewButton',
        type: 'button',
        description: 'A new button component'
      };

      await request(app)
        .post('/api/components')
        .send(componentData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const componentData = {
        description: 'Missing name and type'
      };

      const response = await request(app)
        .post('/api/components')
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData)
        .expect(400);

      expect(response.body.error).toContain('Name and type are required');
    });

    it('should prevent duplicate component names', async () => {
      const componentData = {
        name: 'DuplicateButton',
        type: 'button',
        description: 'A button component'
      };

      // Create first component
      await request(app)
        .post('/api/components')
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/components')
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData)
        .expect(400);

      expect(response.body.error).toContain('already exists');
    });
  });

  describe('GET /api/components/:id', () => {
    it('should return a specific component', async () => {
      const component = new Component({
        name: 'TestComponent',
        type: 'button',
        description: 'Test component',
        createdBy: testUser._id
      });
      await component.save();

      const response = await request(app)
        .get(`/api/components/${component._id}`)
        .expect(200);

      expect(response.body.name).toBe('TestComponent');
      expect(response.body._id).toBe(component._id.toString());
    });

    it('should return 404 for non-existent component', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/components/${fakeId}`)
        .expect(404);
    });
  });

  describe('PUT /api/components/:id', () => {
    it('should update a component', async () => {
      const component = new Component({
        name: 'TestComponent',
        type: 'button',
        description: 'Original description',
        createdBy: testUser._id
      });
      await component.save();

      const updateData = {
        description: 'Updated description',
        status: 'active'
      };

      const response = await request(app)
        .put(`/api/components/${component._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.description).toBe('Updated description');
      expect(response.body.status).toBe('active');
    });

    it('should require authentication', async () => {
      const component = new Component({
        name: 'TestComponent',
        type: 'button',
        createdBy: testUser._id
      });
      await component.save();

      await request(app)
        .put(`/api/components/${component._id}`)
        .send({ description: 'Updated' })
        .expect(401);
    });

    it('should only allow creator to update', async () => {
      const otherUser = new User({
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User'
      });
      await otherUser.save();

      const component = new Component({
        name: 'TestComponent',
        type: 'button',
        createdBy: otherUser._id
      });
      await component.save();

      await request(app)
        .put(`/api/components/${component._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Updated' })
        .expect(403);
    });
  });

  describe('DELETE /api/components/:id', () => {
    it('should delete a component', async () => {
      const component = new Component({
        name: 'TestComponent',
        type: 'button',
        createdBy: testUser._id
      });
      await component.save();

      await request(app)
        .delete(`/api/components/${component._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify component is deleted
      const deletedComponent = await Component.findById(component._id);
      expect(deletedComponent).toBeNull();
    });

    it('should require authentication', async () => {
      const component = new Component({
        name: 'TestComponent',
        type: 'button',
        createdBy: testUser._id
      });
      await component.save();

      await request(app)
        .delete(`/api/components/${component._id}`)
        .expect(401);
    });
  });

  describe('GET /api/components/type/:type', () => {
    it('should return components by type', async () => {
      const components = [
        {
          name: 'Button1',
          type: 'button',
          status: 'active',
          createdBy: testUser._id
        },
        {
          name: 'Button2',
          type: 'button',
          status: 'active',
          createdBy: testUser._id
        },
        {
          name: 'Input1',
          type: 'input',
          status: 'active',
          createdBy: testUser._id
        }
      ];

      await Component.insertMany(components);

      const response = await request(app)
        .get('/api/components/type/button')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(component => {
        expect(component.type).toBe('button');
        expect(component.status).toBe('active');
      });
    });
  });

  describe('GET /api/components/search/:query', () => {
    it('should search components by text', async () => {
      const components = [
        {
          name: 'PrimaryButton',
          type: 'button',
          description: 'A primary action button',
          tags: ['button', 'primary'],
          createdBy: testUser._id
        },
        {
          name: 'SecondaryButton',
          type: 'button',
          description: 'A secondary action button',
          tags: ['button', 'secondary'],
          createdBy: testUser._id
        }
      ];

      await Component.insertMany(components);

      const response = await request(app)
        .get('/api/components/search/primary')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('PrimaryButton');
    });
  });
}); 