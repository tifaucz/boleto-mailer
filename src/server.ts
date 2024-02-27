import { processContent } from './mailer';
const port = 8889;

const server = Bun.serve({
    port: port,
    async fetch(req) {
        const url = new URL(req.url)
        if (req.method === "POST" && url.pathname === "/upload") {
            console.log("POST /upload:", req);
            const formData = await req.formData();
            const file = formData.get("file") as File;
            console.log("file:", file);

            if (!(file instanceof File)) {
              return new Response("No file uploaded", { status: 400 });
            }
                const content = await file.text();
                const expectedHeader = "name,governmentId,email,debtAmount,debtDueDate,debtId";
                const lines = content.split(/\r?\n/);
              
                if (lines[0] !== expectedHeader) {
                  console.log("Incorrect Header:", lines[0]);
                  return new Response("Incorrect Headers", { status: 400 });
                }

                console.log("File name:", file.name);
                console.log("File size:", file.size);
                console.log("File type:", file.type);

                processContent(lines);
                return new Response("Upload success, processing emails");
        }
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Bun listening on http://localhost:${server.port} ...`);

