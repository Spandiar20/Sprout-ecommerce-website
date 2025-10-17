import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete: ", metadata);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),

    variantUploader: f({
      image: {
        maxFileSize: "4MB",
        maxFileCount: 10,
      }
    })
    .onUploadComplete(async ({metadata, file}) => {
      console.log("Upload complete")

      console.log(file)

      return { uploadedBy: metadata}
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
