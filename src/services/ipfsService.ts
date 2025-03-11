
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';
import { IPFSContent, BountyMetadata } from '@/types/content';

// IPFS settings
const IPFS_API_URL = 'https://api.pinata.cloud';
const IPFS_GATEWAY_URL = 'https://blue-shaggy-halibut-668.mypinata.cloud/ipfs';

// Pinata credentials
const PINATA_CREDENTIALS = {
  PINATA_API_KEY: 'c1395b5d3677c459fd05',
  PINATA_API_SECRET: '87d9bb7ce78d82cc263059c8feb6df0d01fb53e2b9cfab1d364acf873331f53e'
};

export const getFromIPFS = async <T extends ProposalMetadata | IPFSContent | BountyMetadata>(
  hash: string,
  type: 'proposal' | 'content' | 'bounty'
): Promise<T> => {
  try {
    console.log('\n=== Starting IPFS Retrieval ===');
    console.log('Getting data for hash:', hash);
    
    if (hash.startsWith('ipfs://')) {
      hash = hash.substring(7);
    }
    
    const gatewayUrl = `${IPFS_GATEWAY_URL}/${hash}`;
    console.log('Fetching from IPFS gateway:', gatewayUrl);
    
    const response = await fetch(gatewayUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Data retrieved from IPFS:', data);
    console.log('=== IPFS Retrieval Complete ===\n');
    
    return data as T;
  } catch (error) {
    console.error('Error in IPFS retrieval:', error);
    throw error; // Propagate the error instead of returning mock data
  }
};

export const uploadToIPFS = async <T extends object>(
  content: T
): Promise<string> => {
  try {
    console.log('\n=== Starting IPFS Upload ===');
    console.log('Content to upload:', JSON.stringify(content, null, 2));
    
    const maxRetries = 3;
    let retries = 0;
    let lastError;
    
    while (retries < maxRetries) {
      try {
        const response = await fetch(`${IPFS_API_URL}/pinning/pinJSONToIPFS`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_CREDENTIALS.PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_CREDENTIALS.PINATA_API_SECRET
          },
          body: JSON.stringify(content)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload to Pinata: ${errorText}`);
        }
        
        const result = await response.json();
        const ipfsHash = result.IpfsHash;
        console.log('Upload successful! IPFS hash:', ipfsHash);
        console.log('=== IPFS Upload Complete ===\n');
        
        return `ipfs://${ipfsHash}`;
      } catch (err) {
        lastError = err;
        retries++;
        console.warn(`Upload attempt ${retries} failed, ${maxRetries - retries} attempts remaining`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }
    
    console.error('All upload attempts failed:', lastError);
    throw lastError;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const getModelFromIPFS = async (hash: string): Promise<string> => {
  try {
    console.log('\n=== Retrieving 3D Model from IPFS ===');
    console.log('Model hash:', hash);
    
    if (hash.startsWith('ipfs://')) {
      hash = hash.substring(7);
    }
    
    // Return gateway URL
    const gatewayUrl = `${IPFS_GATEWAY_URL}/${hash}`;
    console.log('Gateway URL for model:', gatewayUrl);
    console.log('=== Model Retrieval Complete ===\n');
    
    return gatewayUrl;
  } catch (error) {
    console.error('Error retrieving model from IPFS:', error);
    throw error;
  }
};

export const uploadModelToIPFS = async (
  modelFile: File
): Promise<string> => {
  try {
    console.log('\n=== Starting 3D Model Upload to IPFS ===');
    console.log('Uploading model:', modelFile.name);
    
    const formData = new FormData();
    formData.append('file', modelFile);
    
    const metadata = JSON.stringify({
      name: modelFile.name,
      keyvalues: {
        contentType: modelFile.type,
        size: modelFile.size.toString(),
        uploadDate: new Date().toISOString()
      }
    });
    
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 1
    });
    
    formData.append('pinataOptions', options);
    
    const response = await fetch(`${IPFS_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_CREDENTIALS.PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_CREDENTIALS.PINATA_API_SECRET
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata upload failed:', errorText);
      throw new Error('Failed to upload model to Pinata');
    }
    
    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    console.log('Model upload successful! IPFS hash:', ipfsHash);
    console.log('=== 3D Model Upload Complete ===\n');
    
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Error uploading model to IPFS:', error);
    throw error;
  }
};
