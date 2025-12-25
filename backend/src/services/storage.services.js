import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey : "public_I8rle10UsDmeN6FfcmozGX2f++o=",

    privateKey : "private_/r8FioR5NpjLgsyPN+7jcjv5dns=",

    urlEndpoint : "https://ik.imagekit.io/pj2x8w9ape"
});

export async function uploadFile(file, fileName) {
  return await imagekit.upload({
    file,
    fileName
  });
}

export default imagekit;
