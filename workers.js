export default {
  async fetch(request) {
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

    const githubUrl =
      "https://52400128-afk.github.io/midterm-cdn-demo" +
      url.pathname +
      url.search;

    const response = await fetch(githubUrl, {
      cf: {
        cacheEverything: true,
        cacheTtl: 3600,
      },
    });

    const newHeaders = new Headers(response.headers);

    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");

    // 🔥 QUAN TRỌNG NHẤT (FIX LỖI CỦA BẠN)
    newHeaders.set("Access-Control-Expose-Headers", "*");

    newHeaders.set("Cache-Control", "public, max-age=3600");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
