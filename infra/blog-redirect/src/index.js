export default {
  fetch(request) {
    const url = new URL(request.url);
    const target = new URL("https://aaryanporwal.com/blog");
    target.pathname = `/blog${url.pathname === "/" ? "" : url.pathname}`;
    target.search = url.search;
    return Response.redirect(target.toString(), 301);
  },
};
