
interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

const PINATA_API_KEY = "e8141c7ad25bbe26737a";
const PINATA_API_SECRET = "e0e8973e186c9eb3c70332357ddbf20da260b9374d390b76f1d9bd4b3e66eafc";

export const uploadMetadataToPinata = async (metadata: any): Promise<string> => {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Pinata');
    }

    const result: PinataResponse = await response.json();
    const ipfsUrl = `ipfs://${result.IpfsHash}`;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    
    console.log('IPFS Upload Success:', {
      ipfsUrl,
      gatewayUrl,
      hash: result.IpfsHash,
      size: result.PinSize,
      timestamp: result.Timestamp
    });

    return ipfsUrl;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};

export const uploadImageToPinata = async (imageUrl: string): Promise<string> => {
  try {
    // Fetch the image from LinkedIn
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', imageBlob, 'profile.jpg');

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Pinata');
    }

    const result: PinataResponse = await response.json();
    const ipfsUrl = `ipfs://${result.IpfsHash}`;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    
    console.log('Image Upload Success:', {
      ipfsUrl,
      gatewayUrl,
      hash: result.IpfsHash,
      size: result.PinSize,
      timestamp: result.Timestamp
    });

    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading image to Pinata:', error);
    throw error;
  }
};
