"use server";

const PEXELS_URL = "https://api.pexels.com/v1";

export async function fetchPexelsImages(query = "", page = 1) {
  const url = query
    ? `${PEXELS_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=15`
    : `${PEXELS_URL}/curated?page=${page}&per_page=15`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.NEXT_APP_PEXELS_API_KEY || "",
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error("Failed to fetch images from Pexels", response.status);
      return [];
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return [];
  }
}

export async function getPhotoById(id: string | number) {
  const url = `${PEXELS_URL}/photos/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.NEXT_APP_PEXELS_API_KEY || "",
      },
      next: { 
        revalidate: 3600,
        tags: [`photo-${id}`] 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch photo ${id} from Pexels`, response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pexels photo ${id}:`, error);
    return null;
  }
}
