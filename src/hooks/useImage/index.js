import { useInView } from "react-intersection-observer";
import useNativeLazyLoading from "@charlietango/use-native-lazy-loading";
import createCloudinaryUrl from "../utils/createCloudinaryUrl";

export default function useImage(cloudName) {
  const supportsLazyLoading = useNativeLazyLoading();

  const [ref, inView] = useInView({
    triggerOnce: true
  });

  function blurredPlaceholderUrl({ publicId, width, height }) {
    if (!width && !height) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:1000,q_1,f_auto/${publicId}.jpg`;
    } else if (!height) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_${width}/e_blur:1000,q_1,f_auto/${publicId}.jpg`;
    } else if (!width) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,e_blur:1000,q_1,f_auto/h_${height}/${publicId}.jpg`;
    } else {
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width}/c_scale,e_blur:1000,q_1,f_auto/h_${height}/${publicId}.jpg`;
    }
  }

  const generateUrl = createCloudinaryUrl(cloudName, "image");

  return {
    supportsLazyLoading,
    ref,
    inView,
    blurredPlaceholderUrl,
    generateUrl
  };
}
