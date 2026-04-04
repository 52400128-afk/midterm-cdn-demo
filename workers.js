export default {
  async fetch(request) {
    // Xử lý CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const url = new URL(request.url);
    const githubUrl = `https://52400128-afk.github.io/midterm-cdn-demo${url.pathname}${url.search}`;
    
    const response = await fetch(githubUrl);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    newResponse.headers.set("Cache-Control", "public, max-age=3600");
    return newResponse;
  }
};
