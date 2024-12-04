import { describe, it, expect, beforeEach } from 'vitest';

// Mock blockchain state
let tokenBalances: { [key: string]: number } = {};
let tokenUri: string = "";
const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

describe('Incentive Token', () => {
  beforeEach(() => {
    tokenBalances = {};
    tokenUri = "";
  });
  
  it('should mint tokens', () => {
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const amount = 1000;
    
    const mintFn = () => {
      if (contractOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        tokenBalances[recipient] = (tokenBalances[recipient] || 0) + amount;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_OWNER_ONLY' };
    };
    
    const result = mintFn();
    expect(result.isOk).toBe(true);
    expect(tokenBalances[recipient]).toBe(amount);
  });
  
  it('should fail to mint tokens if not contract owner', () => {
    const notOwner = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const amount = 1000;
    
    const mintFn = () => {
      if (notOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        tokenBalances[recipient] = (tokenBalances[recipient] || 0) + amount;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_OWNER_ONLY' };
    };
    
    const result = mintFn();
    expect(result.isOk).toBe(false);
    expect(result.value).toBe('ERR_OWNER_ONLY');
    expect(tokenBalances[recipient]).toBeUndefined();
  });
  
  it('should transfer tokens', () => {
    const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const amount = 500;
    
    tokenBalances[sender] = 1000;
    tokenBalances[recipient] = 0;
    
    const transferFn = () => {
      if (tokenBalances[sender] >= amount) {
        tokenBalances[sender] -= amount;
        tokenBalances[recipient] = (tokenBalances[recipient] || 0) + amount;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_INSUFFICIENT_BALANCE' };
    };
    
    const result = transferFn();
    expect(result.isOk).toBe(true);
    expect(tokenBalances[sender]).toBe(500);
    expect(tokenBalances[recipient]).toBe(500);
  });
  
  it('should fail to transfer tokens with insufficient balance', () => {
    const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const amount = 1500;
    
    tokenBalances[sender] = 1000;
    tokenBalances[recipient] = 0;
    
    const transferFn = () => {
      if (tokenBalances[sender] >= amount) {
        tokenBalances[sender] -= amount;
        tokenBalances[recipient] = (tokenBalances[recipient] || 0) + amount;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_INSUFFICIENT_BALANCE' };
    };
    
    const result = transferFn();
    expect(result.isOk).toBe(false);
    expect(result.value).toBe('ERR_INSUFFICIENT_BALANCE');
    expect(tokenBalances[sender]).toBe(1000);
    expect(tokenBalances[recipient]).toBe(0);
  });
  
  it('should get token balance', () => {
    const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const balance = 1000;
    
    tokenBalances[account] = balance;
    
    const getBalanceFn = () => tokenBalances[account] || 0;
    
    expect(getBalanceFn()).toBe(balance);
  });
  
  it('should set token URI', () => {
    const newUri = "https://example.com/token-metadata.json";
    
    const setTokenUriFn = () => {
      if (contractOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        tokenUri = newUri;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_OWNER_ONLY' };
    };
    
    const result = setTokenUriFn();
    expect(result.isOk).toBe(true);
    expect(tokenUri).toBe(newUri);
  });
  
  it('should fail to set token URI if not contract owner', () => {
    const notOwner = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    const newUri = "https://example.com/token-metadata.json";
    
    const setTokenUriFn = () => {
      if (notOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        tokenUri = newUri;
        return { isOk: true, value: true };
      }
      return { isOk: false, value: 'ERR_OWNER_ONLY' };
    };
    
    const result = setTokenUriFn();
    expect(result.isOk).toBe(false);
    expect(result.value).toBe('ERR_OWNER_ONLY');
    expect(tokenUri).toBe("");
  });
  
  it('should get token URI', () => {
    const uri = "https://example.com/token-metadata.json";
    tokenUri = uri;
    
    const getTokenUriFn = () => ({ isOk: true, value: tokenUri });
    
    const result = getTokenUriFn();
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(uri);
  });
});

