import { opine } from "https://deno.land/x/opine@2.3.3/mod.ts";

const api = opine();

api.get("/", function (_req, res) {
  res.send("Hello World");
});

export default api;
