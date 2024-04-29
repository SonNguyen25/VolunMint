// pages/api/auth.js
export default async function handler(req, res) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.ALCHEMY_API_KEY}`,
      }
    };
  
    try {
      const response = await fetch('https://api.g.alchemy.com/signer/v1/whoami', options);
      
      // Log or check the raw response
      const text = await response.text();  // Get response as text
      console.log(text);  // Log it for debugging
      const data = JSON.parse(text);  // Convert text to JSON
  
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }
  
      res.status(200).json({ user: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
