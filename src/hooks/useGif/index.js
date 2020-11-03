import createCloudinaryUrl from "../utils/createCloudinaryUrl";

export default function useGif(cloudName) {
  const generateUrl = createCloudinaryUrl(cloudName, "gif");

  return {
    generateUrl
  };
}
