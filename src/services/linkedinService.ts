
import { uploadImageToPinata } from "./pinataService";

interface LinkedInProfile {
  success: boolean;
  status: number;
  data: {
    firstName: string;
    lastName: string;
    headline: string;
    profilePic?: string;
    skills: Array<{ title: string }>;
    experiences: Array<{
      title: string;
      subtitle: string;  // company name
      caption: string;   // contains duration
      location?: string;
    }>;
    educations: Array<{
      title: string;     // degree
      subtitle: string;  // school
    }>;
  };
}

interface MarketplaceMetadata {
  name: string;
  description: string;
  image: string;
  contentType: string;
  category: string;
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
  }>;
  skills: Array<string>;
}

export const analyzeLinkedInProfile = async (profileUrl: string): Promise<MarketplaceMetadata> => {
  try {
    const response = await fetch('https://linkedin-bulk-data-scraper.p.rapidapi.com/person', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'b16ff54f96mshe700bf7347e9a71p141b59jsn89af9057b370',
        'X-RapidAPI-Host': 'linkedin-bulk-data-scraper.p.rapidapi.com'
      },
      body: JSON.stringify({ link: profileUrl })
    });

    if (!response.ok) {
      console.error('API Response not OK:', await response.text());
      throw new Error('Failed to analyze LinkedIn profile');
    }

    const linkedInData: LinkedInProfile = await response.json();
    console.log('LinkedIn API Response:', linkedInData);

    // Upload profile picture to IPFS if available
    let profilePicUrl = '';
    if (linkedInData.data?.profilePic) {
      console.log('Uploading profile picture to IPFS...');
      const profilePicCID = await uploadImageToPinata(linkedInData.data.profilePic);
      profilePicUrl = `ipfs://${profilePicCID}`;
      console.log('Profile picture uploaded to IPFS:', profilePicUrl);
    }

    // Process experiences
    const experiences = linkedInData.data.experiences.map(exp => ({
      title: exp.title,
      company: exp.subtitle,
      duration: exp.caption,
      location: exp.location || 'Remote'
    }));

    // Process education
    const education = linkedInData.data.educations.map(edu => ({
      degree: edu.title,
      school: edu.subtitle
    }));

    // Process skills
    const skills = linkedInData.data.skills.map(skill => skill.title);

    // Create marketplace metadata
    const metadata: MarketplaceMetadata = {
      name: `${linkedInData.data.firstName} ${linkedInData.data.lastName}`,
      description: linkedInData.data.headline,
      image: profilePicUrl,
      contentType: 'resume',  // This is a professional resume listing
      category: 'Professional Services',
      experiences,
      education,
      skills
    };

    console.log('Generated Marketplace Metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error analyzing LinkedIn profile:', error);
    throw error;
  }
};
