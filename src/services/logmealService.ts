const LOGMEAL_API_KEY = import.meta.env.VITE_LOGMEAL_API_KEY; // Ensure this is set in your .env file

export const analyzeFoodImage = async (imageFile: File) => {
  if (!LOGMEAL_API_KEY) {
    throw new Error("Logmeal API key is not set. Please set VITE_LOGMEAL_API_KEY in your .env file.");
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch('https://api.logmeal.es/v2/recognition/complete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOGMEAL_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Logmeal API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing food image with Logmeal API:", error);
    throw error;
  }
};

export const getNutrientInfo = async () => {
  if (!LOGMEAL_API_KEY) {
    throw new Error("Logmeal API key is not set. Please set VITE_LOGMEAL_API_KEY in your .env file.");
  }

  try {
    const response = await fetch('https://api.logmeal.com/v2/info/nutrients', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${LOGMEAL_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Logmeal API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching nutrient info from Logmeal API:", error);
    throw error;
  }
};

// You can add similar functions for menu and receipt recognition later if needed.
// export const analyzeMenuImage = async (imageFile: File) => { ... };
// export const analyzeReceiptImage = async (imageFile: File) => { ... };
