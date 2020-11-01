import { useInView } from "react-intersection-observer";
import useNativeLazyLoading from "@charlietango/use-native-lazy-loading";

export function useImage(cloudName) {
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
  };

  function generateUrl({ config = {}, delivery, transformation }) {
    function normalizeTransforms(transforms) {
      const newTransforms = [];
      Object.keys(TRANSFORM_OPTIONS).map((option) =>
        Object.keys(transforms).map((t) => {
          if (option === t) {
            newTransforms.push(`${TRANSFORM_OPTIONS[option]}${transforms[t]}`);
          }
        })
      );

      return newTransforms.join();
    };

    const prefix =
      config === typeof Object
        ? getUrlPrefix(config.cloud.cloudName)
        : getUrlPrefix(cloudName);
    const assetType = handleAssetType(delivery);
    const storageType = handleStorageType(delivery);
    const signature = delivery.signature;
    const transformationString = transformation
      ? normalizeTransforms(transformation)
      : "";
    const version = getUrlVersion(config.url, delivery);
    const publicID = delivery.publicID;

    const url = [
      prefix,
      assetType,
      storageType,
      signature,
      transformationString,
      version,
      publicID
    ]
      .filter((a) => a)
      .join("/")
      .replace(" ", "%20");

    return url;
  }

  function isFileName(publicID) {
    return publicID.indexOf("/") < 0;
  }

  function isUrl(publicID) {
    return publicID.match(/^https?:\//);
  }

  function publicIDContainsVersion(publicID) {
    return publicID.match(/^v[0-9]+/);
  }

  function getUrlPrefix(cloudName) {
    // defaults
    const protocol = "http://";
    const cdnPart = "";
    const subdomain = "res";
    const host = ".cloudinary.com";
    const path = `/${cloudName}`;

    return [protocol, cdnPart, subdomain, host, path].join("");
  }

  function handleAssetType(delivery) {
    //default to image
    if (!delivery || !delivery.assetType) {
      return "image";
    }

    return delivery.assetType;
  }

  function handleStorageType(delivery) {
    //default to upload
    if (!delivery || !delivery.storageType) {
      return "upload";
    }

    return delivery.storageType;
  }

  function getUrlVersion(urlConfig = true, delivery) {
    const shouldForceVersion = urlConfig.forceVersion !== false;

    if (delivery.version) {
      return `v${delivery.version}`;
    }

    // In all these conditions we never force a version
    if (
      publicIDContainsVersion(delivery.publicID) ||
      isUrl(delivery.publicID) ||
      isFileName(delivery.publicID)
    ) {
      return "";
    }

    return shouldForceVersion ? "v1" : "";
  }

  return [generateUrl, blurredPlaceholderUrl, supportsLazyLoading, ref, inView];
}

const TRANSFORM_OPTIONS = {
  angle: "a_",
  aspectRatio: "ar_",
  background: "b_",
  border: "bo_",
  color: "co_",
  colorSpace: "cs_",
  crop: "c_",
  customFunction: "fn_",
  defaultImage: "d_",
  density: "dn_",
  dpr: "dpr_",
  effect: "e_",
  fetchFormat: "f_",
  format: "f_",
  flags: "fl_",
  gravity: "g_",
  height: "h_",
  if: "if_",
  opacity: "o_",
  overlay: "l_",
  page: "p_",
  quality: "q_",
  radius: "r_",
  transformation: "t_",
  underlay: "u_",
  variable: "$_",
  width: "w_",
  x: "x_",
  y: "y_",
  zoom: "z_"
};

/*

const config = {
  cloud: {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
    authToken?: {
      token_name: string,
      duration: string,
      start_time: string,
      expiration: string,
      ip: string;
      acl: string;
      url: string;
      key: string
    }
  },
  api: {
    apiProxy?: string;
    connectionTimeout?: number;
    callbackUrl?: string;
    uploadPrefix?: string;
    timeout?: number;
    uploadTimeout?: number;
    chunkSize?: number;
  },
  url: {
    cdnSubdomain?: boolean;
    secureCdnSubdomain?: boolean;
    cname?: string; // User subdomain (example.cloudinary.com)
    secureDistribution?: boolean;
    privateCdn?: boolean;
    signUrl?: boolean;
    longUrlSignature?: boolean;
    shorten?: boolean;
    useRootPath?: boolean;
    secure?: boolean;
    forceVersion?: boolean;
    analytics?: boolean;
  },
  tag: {
    hiDpi?: boolean;
    clientHints?: boolean;
    unsignedUpload?: boolean;
    voidClosingSlash?: boolean;
    sortAttributes?: boolean;
    videoPosterFormat?: string;
    quotesType?: string;
    contentDelimiter: string;
    responsive: {
      isResponsive: boolean;
      responsiveClass?: string;
      responsiveWidth?: boolean;
      responsivePlaceholder?: string;
    }
  }
}

const delivery = {
  storageType?: string; // type upload/private
  assetType?: string; // resourceType image/video
  version?: number;
  publicID?: string;
  extension?: string;
  suffix ?: string;
  filename?: string;
  location?: string;
  signature?: string;
}
*/
