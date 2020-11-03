import createCloudinaryUrl from "../utils/createCloudinaryUrl";

export default function useVideo(cloudName) {
  const generateUrl = createCloudinaryUrl(cloudName, "audio");

  return {
    generateUrl
  };
}
