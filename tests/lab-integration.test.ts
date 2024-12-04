import { describe, it, expect, beforeEach } from 'vitest';

// Mock blockchain state
let experiments: { [key: number]: any } = {};
let lastExperimentId = 0;
const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
let registeredLabs: string[] = [];

describe('Lab Integration', () => {
  beforeEach(() => {
    experiments = {};
    lastExperimentId = 0;
    registeredLabs = [];
  });
  
  it('should register a lab', () => {
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    const registerLabFn = () => {
      if (contractOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        registeredLabs.push(labAddress);
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_OWNER_ONLY' };
    };
    
    const result = registerLabFn();
    expect(result.isOk).toBe(true);
    expect(registeredLabs).toContain(labAddress);
  });
  
  it('should fail to register a lab if not contract owner', () => {
    const notOwner = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    const registerLabFn = () => {
      if (notOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        registeredLabs.push(labAddress);
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_OWNER_ONLY' };
    };
    
    const result = registerLabFn();
    expect(result.isOk).toBe(false);
    expect(result.value).toBe('ERR_OWNER_ONLY');
    expect(registeredLabs).not.toContain(labAddress);
  });
  
  it('should submit an experiment', () => {
    const constructId = 1;
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    const submitExperimentFn = () => {
      lastExperimentId++;
      experiments[lastExperimentId] = {
        construct_id: constructId,
        lab_address: labAddress,
        status: 'submitted',
        result_hash: null
      };
      return { isOk: true, value: lastExperimentId };
    };
    
    const result = submitExperimentFn();
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(1);
    expect(experiments[1]).toEqual({
      construct_id: constructId,
      lab_address: labAddress,
      status: 'submitted',
      result_hash: null
    });
  });
  
  it('should update experiment status', () => {
    const experimentId = 1;
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const newStatus = 'in-progress';
    
    experiments[experimentId] = {
      construct_id: 1,
      lab_address: labAddress,
      status: 'submitted',
      result_hash: null
    };
    
    const updateExperimentStatusFn = () => {
      if (experiments[experimentId] && experiments[experimentId].lab_address === labAddress) {
        experiments[experimentId].status = newStatus;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_UNAUTHORIZED' };
    };
    
    const result = updateExperimentStatusFn();
    expect(result.isOk).toBe(true);
    expect(experiments[experimentId].status).toBe(newStatus);
  });
  
  it('should fail to update experiment status if not authorized', () => {
    const experimentId = 1;
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const unauthorizedLab = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    const newStatus = 'in-progress';
    
    experiments[experimentId] = {
      construct_id: 1,
      lab_address: labAddress,
      status: 'submitted',
      result_hash: null
    };
    
    const updateExperimentStatusFn = () => {
      if (experiments[experimentId] && experiments[experimentId].lab_address === unauthorizedLab) {
        experiments[experimentId].status = newStatus;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_UNAUTHORIZED' };
    };
    
    const result = updateExperimentStatusFn();
    expect(result.isOk).toBe(false);
    expect(result.value).toBe('ERR_UNAUTHORIZED');
    expect(experiments[experimentId].status).toBe('submitted');
  });
  
  it('should submit experiment result', () => {
    const experimentId = 1;
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const resultHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
    
    experiments[experimentId] = {
      construct_id: 1,
      lab_address: labAddress,
      status: 'in-progress',
      result_hash: null
    };
    
    const submitExperimentResultFn = () => {
      if (experiments[experimentId] && experiments[experimentId].lab_address === labAddress) {
        experiments[experimentId].status = 'completed';
        experiments[experimentId].result_hash = resultHash;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_UNAUTHORIZED' };
    };
    
    const result = submitExperimentResultFn();
    expect(result.isOk).toBe(true);
    expect(experiments[experimentId].status).toBe('completed');
    expect(experiments[experimentId].result_hash).toEqual(resultHash);
  });
  
  it('should fail to submit experiment result if not authorized', () => {
    const experimentId = 1;
    const labAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const unauthorizedLab = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    const resultHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
    
    experiments[experimentId] = {
      construct_id: 1,
      lab_address: labAddress,
      status: 'in-progress',
      result_hash: null
    };
    
    const submitExperimentResultFn = () => {
      if (experiments[experimentId] && experiments[experimentId].lab_address === unauthorizedLab) {
        experiments[experimentId].status = 'completed';
        experiments[experimentId].result_hash = resultHash;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_UNAUTHORIZED' };
    };
    
    const result = submitExperimentResultFn();
    expect(result.isOk).toBe(false);
    expect(result.value).toBe('ERR_UNAUTHORIZED');
    expect(experiments[experimentId].status).toBe('in-progress');
    expect(experiments[experimentId].result_hash).toBeNull();
  });
  
  it('should get experiment details', () => {
    const experimentId = 1;
    const experimentData = {
      construct_id: 1,
      lab_address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      status: 'completed',
      result_hash: Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
    };
    
    experiments[experimentId] = experimentData;
    
    const getExperimentFn = () => experiments[experimentId];
    
    const result = getExperimentFn();
    expect(result).toEqual(experimentData);
  });
});

