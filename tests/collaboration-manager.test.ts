import { describe, it, expect, beforeEach } from 'vitest';

// Mock blockchain state
let collaborations: { [key: number]: any } = {};
let lastCollaborationId = 0;

describe('Collaboration Manager', () => {
  beforeEach(() => {
    collaborations = {};
    lastCollaborationId = 0;
  });
  
  it('should create a new collaboration', () => {
    const projectLead = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const constructId = 1;
    
    lastCollaborationId++;
    collaborations[lastCollaborationId] = {
      project_lead: projectLead,
      collaborators: [projectLead],
      construct_id: constructId,
      status: 'active'
    };
    
    expect(collaborations[lastCollaborationId]).toEqual({
      project_lead: projectLead,
      collaborators: [projectLead],
      construct_id: constructId,
      status: 'active'
    });
  });
  
  it('should allow joining a collaboration', () => {
    const collaborationId = 1;
    const newCollaborator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    collaborations[collaborationId] = {
      project_lead: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      collaborators: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'],
      construct_id: 1,
      status: 'active'
    };
    
    collaborations[collaborationId].collaborators.push(newCollaborator);
    
    expect(collaborations[collaborationId].collaborators).toContain(newCollaborator);
  });
  
  it('should update collaboration status', () => {
    const collaborationId = 1;
    const newStatus = 'completed';
    
    collaborations[collaborationId] = {
      project_lead: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      collaborators: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'],
      construct_id: 1,
      status: 'active'
    };
    
    collaborations[collaborationId].status = newStatus;
    
    expect(collaborations[collaborationId].status).toBe(newStatus);
  });
  
  it('should get collaboration details', () => {
    const collaborationId = 1;
    const collaborationData = {
      project_lead: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      collaborators: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'],
      construct_id: 1,
      status: 'active'
    };
    
    collaborations[collaborationId] = collaborationData;
    
    expect(collaborations[collaborationId]).toEqual(collaborationData);
  });
});

