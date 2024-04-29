const headers = new Headers({
  "Content-Type": "application/json",
  "x-api-key": process.env.CAT_API_KEY,
});

var requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};
export const getCatImage = async () => {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1",
    requestOptions
  );
  return response.json();
};
