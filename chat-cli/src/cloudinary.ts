import axios from "axios";
import { baseUrl } from "./main";

export const cloudinaryFunction = async (dataSave: any, type: string) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const cloudName = import.meta.env.VITE_CLOUDNAME;
  try {
    const signatureResponse = await axios
      .create({ withCredentials: true })
      .get(`${baseUrl}/user/get-signature`);
    const { signature, timestamp } = signatureResponse.data;
    const data = new FormData();
    data.append("file", dataSave);
    // const fileURL = URL.createObjectURL(dataSave);

    const cloudinaryResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload?api_key=${apiKey}&timestamp=${timestamp}&signature=${signature}`,
      data
    );

    const fileData = {
      public_id: cloudinaryResponse.data.public_id,
      version: cloudinaryResponse.data.version,
      signature: cloudinaryResponse.data.signature,
      secure_url: cloudinaryResponse.data.secure_url,
      type: dataSave.type.startsWith("audio") ? "audio" : "image",
    };
    return fileData;
  } catch (error) {
    console.log(error);
  }
};
