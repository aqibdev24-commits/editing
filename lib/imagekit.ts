import ImageKit from 'imagekit';

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? '',
});

export const IMAGEKIT_FOLDERS = {
  thumbnails: '/vexora/thumbnails',
  videos: '/vexora/videos',
  audio: '/vexora/audio',
  images: '/vexora/images',
  avatars: '/vexora/avatars',
  exports: '/vexora/exports',
} as const;

export type ImageKitFolder = (typeof IMAGEKIT_FOLDERS)[keyof typeof IMAGEKIT_FOLDERS];